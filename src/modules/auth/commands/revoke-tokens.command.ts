import { ICurrentUser } from '@common/interfaces';
import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import { SessionEntity } from '@modules/session/entities/session.entity';
import { SessionService } from '@modules/session/session.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

export class RevokeTokensCommand implements ICommand {
  constructor(public readonly user: ICurrentUser) {}
}

@Injectable()
@CommandHandler(RevokeTokensCommand)
export class RevokeTokensCommandHandler
  implements ICommandHandler<RevokeTokensCommand>
{
  constructor(private readonly sessionService: SessionService) {}

  async execute(command: RevokeTokensCommand): Promise<void> {
    const { user } = command;

    const session: SessionEntity = Optional.of(
      await this.sessionService.findById(user.sessionId as Uuid),
    )
      .throwIfNullable(new BadRequestException('Session not found'))
      .get();

    await this.sessionService.deleteByUserIdWithExclude({
      userId: user.id as Uuid,
      excludeSessionId: session.id,
    });
  }
}
