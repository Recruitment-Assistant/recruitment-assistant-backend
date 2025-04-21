import { GOOGLE_URL } from '@common/constants/app.constant';
import { CacheKey } from '@common/constants/cache.constant';
import { ROLE } from '@common/constants/entity.enum';
import { ErrorCode } from '@common/constants/error-code';
import { CommonFunction } from '@common/helpers/common.function';
import { Uuid } from '@common/types/common.type';
import { JwtUtil } from '@common/utils/jwt.util';
import { Optional } from '@common/utils/optional';
import { hashPassword, verifyPassword } from '@common/utils/password.util';
import { MailService } from '@libs/mail/mail.service';
import { CacheTTL } from '@libs/redis/utils/cache-ttl.utils';
import { CreateCacheKey } from '@libs/redis/utils/create-cache-key.utils';
import { EmailReqDto } from '@modules/auth/dto/request/email.req.dto';
import { LoginWithGoogleReqDto } from '@modules/auth/dto/request/login-with-google.req.dto';
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
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICurrentUser } from 'src/common/interfaces';
import { LoginReqDto } from './dto/request/login.req.dto';
import { RefreshReqDto } from './dto/request/refresh.req.dto';
import { RegisterReqDto } from './dto/request/register.req.dto';
import { LoginResDto } from './dto/response/login.res.dto';
import { RefreshResDto } from './dto/response/refresh.res.dto';
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
  ) {}

  async signIn(
    dto: LoginReqDto,
    forAdmin: boolean = false,
  ): Promise<LoginResDto> {
    const { email, password } = dto;
    const user = Optional.of(
      await this.userService.findOneByCondition({ email }),
    )
      .throwIfNullable(new NotFoundException(ErrorCode.ACCOUNT_NOT_REGISTER))
      .get() as UserEntity;

    const roles = user.roles.map((role) => role.name);

    if (forAdmin && !roles.includes(ROLE.ADMIN)) {
      throw new UnauthorizedException(ErrorCode.ACCESS_DENIED);
    }

    if (!user.isActive || !user.isConfirmed) {
      throw new BadRequestException(ErrorCode.ACCOUNT_NOT_ACTIVATED);
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
    }

    return this.createToken(user);
  }

  async loginWithGoogle(dto: LoginWithGoogleReqDto) {
    const googleResponse = await firstValueFrom(
      this.httpService
        .get(GOOGLE_URL.concat(dto.accessToken))
        .pipe(map((response) => response.data)),
    );
    const user = await this.userService.findOneByCondition({
      email: googleResponse.email,
    });
    if (user !== null) {
      return this.createToken(user);
    } else {
      const isDeletedUser = await this.userService.isExistUserByEmail(
        googleResponse.email,
      );
      if (isDeletedUser) {
        throw new BadRequestException(ErrorCode.ACCOUNT_LOCKED);
      }

      const newUser = await this.userService.create({
        email: googleResponse.email,
        password: googleResponse.id,
        name: googleResponse.name,
        avatar: googleResponse.picture,
      });
      return this.createToken(newUser);
    }
  }

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

  async logout(sessionId: Uuid | string): Promise<void> {
    Optional.of(
      await this.sessionService.findById(sessionId as Uuid),
    ).throwIfNotPresent(new UnauthorizedException(ErrorCode.UNAUTHORIZED));
    await this.sessionService.deleteById(sessionId);
  }

  async refreshToken(
    dto: RefreshReqDto,
    forAdmin: boolean = false,
  ): Promise<RefreshResDto> {
    const { sessionId, hash } = this.jwtUtil.verifyRefreshToken(
      dto.refreshToken,
    );
    const session = await this.sessionService.findById(sessionId);
    if (!session || session.hash !== hash) {
      throw new UnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
    }

    const user = await this.userService.findOneByCondition({
      id: session.userId,
    });
    const roles = user.roles.map((role) => role.name);
    if (forAdmin && !roles.includes(ROLE.ADMIN)) {
      throw new UnauthorizedException(ErrorCode.ACCESS_DENIED);
    }

    return this.createToken(user, sessionId);
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
    });

    return plainToInstance(LoginResDto, {
      userId: user.id,
      ...token,
    });
  }
}
