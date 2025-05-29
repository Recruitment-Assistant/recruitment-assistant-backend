import { Uuid } from '@common/types/common.type';
import { ApplyJobDto } from '@modules/application/dto/apply.job.dto';
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

export class ApplyJobCommand implements ICommand {
  constructor(
    public readonly jobId: Uuid,
    public readonly dto: ApplyJobDto,
    public readonly resume: Express.Multer.File,
  ) {}
}

@Injectable()
@CommandHandler(ApplyJobCommand)
export class ApplyJobCommandHandler
  implements ICommandHandler<ApplyJobCommand>
{
  constructor() {}

  async execute(command: ApplyJobCommand): Promise<void> {}
}
