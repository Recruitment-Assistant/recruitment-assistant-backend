import { ROLE } from '@common/constants/entity.enum';
import { ErrorCode } from '@common/constants/error-code';
import { JwtUtil } from '@common/utils/jwt.util';
import { AuthService } from '@modules/auth/auth.service';
import { RefreshReqDto } from '@modules/auth/dto/request/refresh.req.dto';
import { SessionService } from '@modules/session/session.service';
import { UserService } from '@modules/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

export class RefreshTokenCommand implements ICommand {
  constructor(
    public readonly dto: RefreshReqDto,
    public readonly forAdmin: boolean = false,
  ) {}
}

@Injectable()
@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly jwtUtil: JwtUtil,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { dto, forAdmin } = command;

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

    return this.authService.createToken(user, sessionId);
  }
}
