import { GOOGLE_URL } from '@common/constants/app.constant';
import { ErrorCode } from '@common/constants/error-code';
import { AuthService } from '@modules/auth/auth.service';
import { LoginWithGoogleReqDto } from '@modules/auth/dto/request/login-with-google.req.dto';
import { UserService } from '@modules/user/user.service';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

export class LoginGoogleCommand implements ICommand {
  constructor(public readonly dto: LoginWithGoogleReqDto) {}
}

@Injectable()
@CommandHandler(LoginGoogleCommand)
export class LoginGoogleCommandHandler
  implements ICommandHandler<LoginGoogleCommand>
{
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async execute(command: LoginGoogleCommand) {
    const { accessToken } = command.dto;

    const googleResponse = await firstValueFrom(
      this.httpService
        .get(GOOGLE_URL.concat(accessToken))
        .pipe(map((response) => response.data)),
    );

    const user = await this.userService.findOneByCondition({
      email: googleResponse.email,
    });

    if (user !== null) {
      return this.authService.createToken(user);
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
      return this.authService.createToken(newUser);
    }
  }
}
