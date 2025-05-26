import { CommonModule } from '@common/common.module';
import { LogoutCommandHandler } from '@modules/auth/commands/log-out.command';
import { LoginGoogleCommandHandler } from '@modules/auth/commands/login-google.command';
import { LoginCommandHandler } from '@modules/auth/commands/login.command';
import { RefreshTokenCommandHandler } from '@modules/auth/commands/refresh-token.command';
import { RequestPasswordResetCommandHandler } from '@modules/auth/commands/request-password-reset.command';
import { ResetPasswordCommandHandler } from '@modules/auth/commands/reset-password.command';
import { RevokeTokensCommandHandler } from '@modules/auth/commands/revoke-tokens.command';
import { AdminAuthController } from '@modules/auth/controllers/admin-auth.controller';
import { SessionModule } from '@modules/session/session.module';
import { UserModule } from '@modules/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';

const commandHandlers: Provider[] = [
  LoginCommandHandler,
  LoginGoogleCommandHandler,
  RefreshTokenCommandHandler,
  LogoutCommandHandler,
  RequestPasswordResetCommandHandler,
  ResetPasswordCommandHandler,
  RevokeTokensCommandHandler,
];

@Module({
  imports: [UserModule, SessionModule, CommonModule, HttpModule.register({})],
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService, ...commandHandlers],
  exports: [AuthService],
})
export class AuthModule {}
