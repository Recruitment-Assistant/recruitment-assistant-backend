import { CacheKey } from '@common/constants/cache.constant';
import { ErrorCode } from '@common/constants/error-code';
import { CommonFunction } from '@common/helpers/common.function';
import { JwtUtil } from '@common/utils/jwt.util';
import { Optional } from '@common/utils/optional';
import { MailService } from '@libs/mail/mail.service';
import { CacheTTL } from '@libs/redis/utils/cache-ttl.utils';
import { CreateCacheKey } from '@libs/redis/utils/create-cache-key.utils';
import { EmailReqDto } from '@modules/auth/dto/request/email.req.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import type { Cache } from 'cache-manager';

export class RequestPasswordResetCommand implements ICommand {
  constructor(public readonly dto: EmailReqDto) {}
}

@Injectable()
@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetCommandHandler
  implements ICommandHandler<RequestPasswordResetCommand>
{
  constructor(
    private readonly userService: UserService,
    private readonly jwtUtil: JwtUtil,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    private readonly mailService: MailService,
  ) {}

  async execute(command: RequestPasswordResetCommand): Promise<void> {
    const { email } = command.dto;

    const user = Optional.of(
      await this.userService.findOneByCondition({
        email,
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

    await this.mailService.forgotPassword(email, token);
  }
}
