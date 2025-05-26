import { CacheKey } from '@common/constants/cache.constant';
import { ErrorCode } from '@common/constants/error-code';
import { Uuid } from '@common/types/common.type';
import { JwtUtil } from '@common/utils/jwt.util';
import { Optional } from '@common/utils/optional';
import { hashPassword } from '@common/utils/password.util';
import { CreateCacheKey } from '@libs/redis/utils/create-cache-key.utils';
import { ResetPasswordReqDto } from '@modules/auth/dto/request/reset-password.req.dto';
import { UserService } from '@modules/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import type { Cache } from 'cache-manager';

export class ResetPasswordCommand implements ICommand {
  constructor(public readonly dto: ResetPasswordReqDto) {}
}

@Injectable()
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly jwtUtil: JwtUtil,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
  ) {}

  async execute(command: ResetPasswordCommand) {
    const { dto } = command;
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
}
