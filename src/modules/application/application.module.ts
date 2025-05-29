import { CandidateModule } from '@modules/candidate/candidate.module';
import { FileModule } from '@modules/file/file.module';
import { LlmModule } from '@modules/llm/llm.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeAnalyzerAdapter } from './adapters/resume-analyzer.adapter';
import { ResumeParserAdapter } from './adapters/resume-parser.adapter';
import { ApplicationService } from './application.service';
import { RESUME_ANALYZER_PORT, RESUME_PARSER_PORT } from './constants';
import { ApplicationController } from './controllers/application.controller';
import { ApplicationEntity } from './entities/application.entity';
import { ResumeAnalysisLogEntity } from './entities/resume-analysis-log.entity';
import { ApplicationRepository } from './repositories/application.repository';
import { ResumeAnalysisLogRepository } from './repositories/resume-analysis-log.repository';
import { UploadResumeByJobIdUseCase } from './use-cases/upload-resume-by-job-id.use-case';

const providers = [
  ApplicationService,
  UploadResumeByJobIdUseCase,
  {
    provide: RESUME_PARSER_PORT,
    useClass: ResumeParserAdapter,
  },
  {
    provide: RESUME_ANALYZER_PORT,
    useClass: ResumeAnalyzerAdapter,
  },
  ApplicationRepository,
  ResumeAnalysisLogRepository,
];

@Module({
  imports: [
    LlmModule,
    TypeOrmModule.forFeature([ApplicationEntity, ResumeAnalysisLogEntity]),
    CandidateModule,
    FileModule,
  ],
  controllers: [ApplicationController],
  providers,
  exports: [
    UploadResumeByJobIdUseCase,
    RESUME_PARSER_PORT,
    RESUME_ANALYZER_PORT,
    ApplicationService,
  ],
})
export class ApplicationModule {}
