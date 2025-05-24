import { CacheKey } from '@common/constants/cache.constant';
import { ErrorCode } from '@common/constants/error-code';
import { CommonFunction } from '@common/helpers/common.function';
import { Uuid } from '@common/types/common.type';
import { JwtUtil } from '@common/utils/jwt.util';
import { Optional } from '@common/utils/optional';
import { hashPassword } from '@common/utils/password.util';
import { MailService } from '@libs/mail/mail.service';
import { CacheTTL } from '@libs/redis/utils/cache-ttl.utils';
import { CreateCacheKey } from '@libs/redis/utils/create-cache-key.utils';
import { EmailReqDto } from '@modules/auth/dto/request/email.req.dto';
import { ResetPasswordReqDto } from '@modules/auth/dto/request/reset-password.req.dto';
import { VerifyPinCodeReqDto } from '@modules/auth/dto/request/verify-pin-code.req.dto';
import { SessionEntity } from '@modules/session/entities/session.entity';
import { SessionService } from '@modules/session/session.service';
import { UserEntity } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/user.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { ICurrentUser } from 'src/common/interfaces';
import { OrganizationService } from '../organization/organization.service';
import { RegisterReqDto } from './dto/request/register.req.dto';
import { LoginResDto } from './dto/response/login.res.dto';
import { RegisterResDto } from './dto/response/register.res.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtUtil: JwtUtil,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    private readonly organizationService: OrganizationService,
  ) {}

  async register(dto: RegisterReqDto): Promise<RegisterResDto> {
    const { email, password, name } = dto;
    const emailIsExist = await this.userService.isExistUserByEmail(email);
    if (emailIsExist) {
      throw new BadRequestException(ErrorCode.EMAIL_EXISTS);
    }

    const user = await this.userService.create({ email, password, name });

    const token = await this.jwtUtil.createVerificationToken({ id: user.id });

    await this.mailService.sendEmailVerification(email, token);

    return plainToInstance(RegisterResDto, {
      userId: user.id,
    });
  }

  async verifyActivationToken(token: string) {
    const { id } = this.jwtUtil.verifyActivateAccountToken(token);

    Optional.of(
      await this.userService.updateUser(id as Uuid, {
        isConfirmed: true,
        isActive: true,
      }),
    ).throwIfNullable(new BadRequestException(ErrorCode.ACCOUNT_NOT_REGISTER));
  }

  async resendEmailActivation(dto: EmailReqDto) {
    const user = Optional.of(
      await this.userService.findOneByCondition({
        email: dto.email,
      }),
    )
      .throwIfNullable(new NotFoundException(ErrorCode.ACCOUNT_NOT_REGISTER))
      .get() as UserEntity;

    if (user.isActive) {
      throw new BadRequestException(ErrorCode.ACCOUNT_ALREADY_ACTIVATED);
    }

    const token = await this.jwtUtil.createVerificationToken({ id: user.id });

    await this.mailService.sendEmailVerification(user.email, token);
  }

  async forgotPassword(dto: EmailReqDto) {
    const user = Optional.of(
      await this.userService.findOneByCondition({
        email: dto.email,
      }),
    )
      .throwIfNullable(new NotFoundException(ErrorCode.USER_NOT_FOUND))
      .get() as UserEntity;

    const pinCode = CommonFunction.generatePinCode(6);
    const [token] = await Promise.all([
      this.jwtUtil.createResetPasswordToken({ id: user.id }),
      this.cacheService.set(
        CreateCacheKey(CacheKey.PASSWORD_RESET_PIN_CODE, user.id),
        pinCode,
        CacheTTL.minutes(30),
      ),
    ]);

    await this.mailService.forgotPassword(dto.email, token);

    return { token };
  }

  async verifyResetPasswordToken(token: string) {
    this.jwtUtil.verifyResetPasswordToken(token);
  }

  async verifyPinCodeResetPassword(dto: VerifyPinCodeReqDto) {
    const { token, pinCode } = dto;
    const { id } = this.jwtUtil.verifyResetPasswordToken(token);

    const pinCodeCached = await this.cacheService.get<string>(
      CreateCacheKey(CacheKey.PASSWORD_RESET_PIN_CODE, id),
    );

    if (!pinCodeCached || pinCodeCached !== pinCode) {
      throw new BadRequestException(ErrorCode.CODE_INCORRECT);
    }
  }

  async resetPassword(dto: ResetPasswordReqDto) {
    const { id } = this.jwtUtil.verifyResetPasswordToken(dto.token);

    Optional.of(
      await this.userService.findOneUserAndGetRolesById(id as Uuid),
    ).throwIfNullable(new BadRequestException(ErrorCode.TOKEN_INVALID));

    await Promise.allSettled([
      this.userService.updateUser(id as Uuid, {
        password: await hashPassword(dto.password),
      }),
      this.cacheService.del(
        CreateCacheKey(CacheKey.PASSWORD_RESET_PIN_CODE, id),
      ),
    ]);
  }

  async revokeTokens(user: ICurrentUser) {
    const session: SessionEntity = Optional.of(
      await this.sessionService.findById(user.sessionId as Uuid),
    )
      .throwIfNullable(new BadRequestException('Session not found'))
      .get();

    await this.sessionService.deleteByUserIdWithExclude({
      userId: user.id as Uuid,
      excludeSessionId: session.id,
    });
  }

  async createToken(user: UserEntity, sessionId?: Uuid) {
    const newHash = CommonFunction.generateHashInToken();
    const session = sessionId
      ? await this.sessionService.update(sessionId, { hash: newHash })
      : await this.sessionService.create({
          hash: newHash,
          userId: user.id,
        });

    const token = await this.jwtUtil.createToken({
      id: user.id,
      sessionId: session.id,
      hash: newHash,
      roles: user.roles.map((role) => role.name),
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    });

    return plainToInstance(LoginResDto, {
      userId: user.id,
      ...token,
    });
  }

  async selectOrganizationAndGenerateToken(user: ICurrentUser, orgId: Uuid) {
    const isMember = await this.organizationService.isUserMemberOfOrganization(
      user.id,
      orgId,
    );
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    const newHash = CommonFunction.generateHashInToken();
    await this.sessionService.update(user.sessionId, {
      hash: newHash,
    });

    const token = await this.jwtUtil.createToken({
      id: user.id,
      sessionId: user.sessionId,
      hash: newHash,
      roles: user.roles,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      organizationId: orgId,
    });

    return plainToInstance(LoginResDto, {
      userId: user.id,
      ...token,
    });
  }
}
