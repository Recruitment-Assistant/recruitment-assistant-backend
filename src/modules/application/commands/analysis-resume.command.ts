import { ICurrentUser } from '@common/interfaces';
import { Uuid } from '@common/types/common.type';
import { Job } from '@modules/job/domain/entities/job';

export interface AnalysisResumeCommand {
  jobId: Uuid;
  user: ICurrentUser;
  resumeFile: Express.Multer.File;
  job?: Job;
}
