import { EventService } from '@common/events/event.service';
import { Uuid } from '@common/types/common.type';
import { Job } from '@modules/job/domain/entities/job';
import { GetJobByIdEvent } from '@modules/job/domain/events/get-job-by-id.event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadResumeByJobIdUseCase {
  constructor(private readonly eventService: EventService) {}
  async execute(jobId: Uuid, files: Array<Express.Multer.File>) {
    const job: Job = await this.eventService.emitAsync(
      new GetJobByIdEvent(jobId),
    );
  }
}
