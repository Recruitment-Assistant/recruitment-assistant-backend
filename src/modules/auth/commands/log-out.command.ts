import { ErrorCode } from '@common/constants/error-code';
import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import { LoginCommand } from '@modules/auth/commands/login.command';
import { SessionService } from '@modules/session/session.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

export class LogoutCommand implements ICommand {
  constructor(public readonly sessionId: Uuid) {}
}

@Injectable()
@CommandHandler(LoginCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly sessionService: SessionService) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { sessionId } = command;

    Optional.of(
      await this.sessionService.findById(sessionId as Uuid),
    ).throwIfNotPresent(new UnauthorizedException(ErrorCode.UNAUTHORIZED));
    await this.sessionService.deleteById(sessionId);
  }
}
