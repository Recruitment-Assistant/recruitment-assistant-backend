import { ROLE } from '@common/constants/entity.enum';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@common/decorators/http.decorators';
import { RolesGuard } from '@common/guards/role.guard';
import { Uuid } from '@common/types/common.type';
import { AuthService } from '@modules/auth/auth.service';
import { LogoutCommand } from '@modules/auth/commands/log-out.command';
import { LoginCommand } from '@modules/auth/commands/login.command';
import { RefreshTokenCommand } from '@modules/auth/commands/refresh-token.command';
import { LoginReqDto } from '@modules/auth/dto/request/login.req.dto';
import { RefreshReqDto } from '@modules/auth/dto/request/refresh.req.dto';
import { LoginResDto } from '@modules/auth/dto/response/login.res.dto';
import { RefreshResDto } from '@modules/auth/dto/response/refresh.res.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin auth APIs')
@Controller({
  path: 'admin/auth',
  version: '1',
})
export class AdminAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiPublic({
    type: LoginResDto,
    summary: 'Sign in for admin',
  })
  @Post('login')
  async signInAdmin(@Body() userLogin: LoginReqDto): Promise<LoginResDto> {
    return this.commandBus.execute(new LoginCommand(userLogin, true));
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Refresh token for admin',
  })
  @Post('refresh')
  async refreshAdmin(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return this.commandBus.execute(new RefreshTokenCommand(dto));
  }

  @ApiAuth({
    summary: 'Logout for admin',
    roles: [ROLE.ADMIN],
  })
  @UseGuards(RolesGuard)
  @Post('logout')
  logoutAdmin(@CurrentUser('sessionId') sessionId: Uuid): Promise<void> {
    return this.commandBus.execute(new LogoutCommand(sessionId));
  }
}
