import { ICurrentUser } from '@common/interfaces';
import { Uuid } from '@common/types/common.type';
import { FileEntity } from '@database/entities/file.entity';
import { AnalysisResult } from './analysis-result.dto';
import { ResumeData } from './resume-parsed.dto';

export interface IPayloadCreateApplication {
  resumeData?: ResumeData;
  analysisResult: AnalysisResult;
  jobId: Uuid;
  resumeText: string;
  resume: FileEntity;
  user?: ICurrentUser;
  organizationId: Uuid;
  candidateId?: Uuid;
}
