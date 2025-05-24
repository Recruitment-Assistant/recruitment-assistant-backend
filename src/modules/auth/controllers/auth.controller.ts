import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@common/decorators/http.decorators';
import { ICurrentUser } from '@common/interfaces';
import { Uuid } from '@common/types/common.type';
import { LogoutCommand } from '@modules/auth/commands/log-out.command';
import { LoginGoogleCommand } from '@modules/auth/commands/login-google.command';
import { LoginCommand } from '@modules/auth/commands/login.command';
import { RefreshTokenCommand } from '@modules/auth/commands/refresh-token.command';
import { ConfirmEmailReqDto } from '@modules/auth/dto/request/confirm-email.req.dto';
import { EmailReqDto } from '@modules/auth/dto/request/email.req.dto';
import { LoginWithGoogleReqDto } from '@modules/auth/dto/request/login-with-google.req.dto';
import { ResetPasswordReqDto } from '@modules/auth/dto/request/reset-password.req.dto';
import { VerifyPinCodeReqDto } from '@modules/auth/dto/request/verify-pin-code.req.dto';
import { TokenDto } from '@modules/auth/dto/token.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { LoginReqDto } from '../dto/request/login.req.dto';
import { RefreshReqDto } from '../dto/request/refresh.req.dto';
import { RegisterReqDto } from '../dto/request/register.req.dto';
import { SelectOrgDto } from '../dto/request/select-org.dto';
import { LoginResDto } from '../dto/response/login.res.dto';
import { RefreshResDto } from '../dto/response/refresh.res.dto';
import { RegisterResDto } from '../dto/response/register.res.dto';

@ApiTags('Auth APIs')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiPublic({
    type: RegisterResDto,
    summary: 'Register for user',
  })
  @Post('register')
  async register(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
    return this.authService.register(dto);
  }

  @ApiPublic({
    type: LoginResDto,
    summary: 'Sign in for user',
  })
  @Post('login')
  async login(@Body() userLogin: LoginReqDto): Promise<LoginResDto> {
    return this.commandBus.execute(new LoginCommand(userLogin));
  }

  @ApiPublic({
    type: LoginResDto,
    summary: 'Login with google',
  })
  @Post('google')
  async loginWithGoogle(@Body() request: LoginWithGoogleReqDto) {
    return this.commandBus.execute(new LoginGoogleCommand(request));
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Refresh token for user',
  })
  @Post('refresh')
  async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return this.commandBus.execute(new RefreshTokenCommand(dto));
  }

  @ApiAuth({
    summary: 'Logout for user',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Post('logout')
  async logout(@CurrentUser('sessionId') sessionId: Uuid): Promise<void> {
    return this.commandBus.execute(new LogoutCommand(sessionId));
  }

  @ApiPublic({
    summary: 'Verify activation token',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Get('activation/verify-token')
  async verifyEmail(@Query() query: ConfirmEmailReqDto) {
    return this.authService.verifyActivationToken(query.token);
  }

  @ApiPublic({
    summary: 'Resend activation email',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Post('activation/resend-email')
  async resendVerifyEmail(@Body() dto: EmailReqDto) {
    return this.authService.resendEmailActivation(dto);
  }

  @ApiPublic({
    summary: 'Forgot password',
    statusCode: HttpStatus.OK,
    type: TokenDto,
  })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: EmailReqDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiPublic({
    summary: 'Verify token reset password',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Get('reset-password/verify-token')
  async verifyResetPasswordToken(@Query() query: TokenDto) {
    return this.authService.verifyResetPasswordToken(query.token);
  }

  @ApiPublic({
    summary: 'Verify pin code reset password',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Post('reset-password/verify-pincode')
  verifyResetPasswordPinCode(@Body() body: VerifyPinCodeReqDto) {
    return this.authService.verifyPinCodeResetPassword(body);
  }

  @ApiPublic({
    summary: 'Reset password',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordReqDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiAuth({
    summary: 'Revoke tokens in other login sessions',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Delete('revoke-token')
  revokeToken(@CurrentUser() user: ICurrentUser) {
    return this.authService.revokeTokens(user);
  }

  @Post('select-organization')
  @ApiAuth({
    summary: 'Select a organization',
    statusCode: HttpStatus.OK,
    type: LoginResDto,
  })
  selectOrganization(
    @CurrentUser() user: ICurrentUser,
    @Body() selectOrgDto: SelectOrgDto,
  ) {
    return this.authService.selectOrganizationAndGenerateToken(
      user,
      selectOrgDto.organizationId,
    );
  }
}
