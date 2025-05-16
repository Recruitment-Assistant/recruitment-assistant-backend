import { LlmModule } from '@modules/llm/llm.module';
import { Module } from '@nestjs/common';
import { ResumeAnalyzerAdapter } from './adapters/resume-analyzer.adapter';
import { ResumeParserAdapter } from './adapters/resume-parser.adapter';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { RESUME_ANALYZER_PORT, RESUME_PARSER_PORT } from './constants';
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
];

@Module({
  imports: [LlmModule],
  controllers: [ApplicationController],
  providers,
  exports: [
    UploadResumeByJobIdUseCase,
    RESUME_PARSER_PORT,
    RESUME_ANALYZER_PORT,
  ],
})
export class ApplicationModule {}
