import { CommonModule } from '@common/common.module';
import { LogoutCommandHandler } from '@modules/auth/commands/log-out.command';
import { LoginGoogleCommandHandler } from '@modules/auth/commands/login-google.command';
import { LoginCommandHandler } from '@modules/auth/commands/login.command';
import { RefreshTokenCommandHandler } from '@modules/auth/commands/refresh-token.command';
import { AdminAuthController } from '@modules/auth/controllers/admin-auth.controller';
import { SessionModule } from '@modules/session/session.module';
import { UserModule } from '@modules/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { OrganizationModule } from '../organization/organization.module';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';

const commandHandlers: Provider[] = [
  LoginCommandHandler,
  LoginGoogleCommandHandler,
  RefreshTokenCommandHandler,
  LogoutCommandHandler,
];

@Module({
  imports: [
    UserModule,
    SessionModule,
    CommonModule,
    HttpModule.register({}),
    OrganizationModule,
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService, ...commandHandlers],
})
export class AuthModule {}
