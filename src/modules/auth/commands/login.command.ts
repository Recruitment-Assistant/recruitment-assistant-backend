import { ROLE } from '@common/constants/entity.enum';
import { ErrorCode } from '@common/constants/error-code';
import { Optional } from '@common/utils/optional';
import { verifyPassword } from '@common/utils/password.util';
import { AuthService } from '@modules/auth/auth.service';
import { LoginReqDto } from '@modules/auth/dto/request/login.req.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

export class LoginCommand implements ICommand {
  constructor(
    public readonly loginDto: LoginReqDto,
    public readonly forAdmin: boolean = false,
  ) {}
}

@Injectable()
@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command.loginDto;
    const { forAdmin } = command;

    const user = Optional.of(
      await this.userService.findOneByCondition({ email }),
    )
      .throwIfNullable(new NotFoundException(ErrorCode.ACCOUNT_NOT_REGISTER))
      .get<UserEntity>();

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

    return this.authService.createToken(user);
  }
}
