import { EventService } from '@common/events/event.service';
import { Uuid } from '@common/types/common.type';
import { ApplicationService } from '@modules/application/application.service';
import {
  RESUME_ANALYZER_PORT,
  RESUME_PARSER_PORT,
} from '@modules/application/constants';
import { generateJDtext } from '@modules/application/constants/prompt-analysis-resume.constant';
import { ApplyJobDto } from '@modules/application/dto/apply.job.dto';
import { ResumeAnalyzerPort } from '@modules/application/ports/resume-analyzer.port';
import { ResumeParserPort } from '@modules/application/ports/resume-parser.port';
import { ApplicationRepository } from '@modules/application/repositories/application.repository';
import { ResumeAnalysisLogRepository } from '@modules/application/repositories/resume-analysis-log.repository';
import { CandidateRepository } from '@modules/candidate/repositories/candidate.repository';
import { FileInfoResDto } from '@modules/file/dto/file-info.res.dto';
import { FileService } from '@modules/file/file.service';
import { Job } from '@modules/job/domain/entities/job';
import { GetJobByIdEvent } from '@modules/job/domain/events/get-job-by-id.event';
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import fs from 'fs';
import PdfParse from 'pdf-parse';

export class ApplyJobCommand implements ICommand {
  constructor(
    public readonly jobId: Uuid,
    public readonly dto: ApplyJobDto,
    public readonly resume: Express.Multer.File,
    public readonly job?: Job,
  ) {}
}

@Injectable()
@CommandHandler(ApplyJobCommand)
export class ApplyJobCommandHandler
  implements ICommandHandler<ApplyJobCommand>
{
  constructor(
    private readonly eventService: EventService,
    private readonly candidateRepository: CandidateRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly resumeLogRepository: ResumeAnalysisLogRepository,
    private readonly fileService: FileService,
    @Inject(RESUME_PARSER_PORT)
    private readonly parser: ResumeParserPort,
    @Inject(RESUME_ANALYZER_PORT)
    private readonly analyzer: ResumeAnalyzerPort,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(command: ApplyJobCommand) {
    const { resume, jobId, dto } = command;
    try {
      const job =
        command.job ??
        (await this.eventService.emitAsync(new GetJobByIdEvent(jobId)));

      const dataBuffer = fs.readFileSync(resume.path);
      resume.buffer = resume.buffer ?? dataBuffer;
      const pdfData = await PdfParse(dataBuffer);
      const resumeText = pdfData.text;

      const resumeUpload: FileInfoResDto =
        await this.fileService.handleFileUpload(resume);

      const resumeData = await this.parser.parse(dataBuffer);

      const JD_TEXT = generateJDtext(job.description, job.requirements);
      const analysisResult = await this.analyzer.analyze(JD_TEXT, resumeText);

      const result = await this.applicationService.saveAnalysisResults({
        analysisResult,
        resumeData,
        jobId,
        resumeText,
        resume: resumeUpload,
        organizationId: job.organizationId,
      });
    } catch (error) {
      console.error('Error applying for job:', error);
    } finally {
      fs.unlink(resume.path, (err) => {
        if (err) console.error(`Failed to delete file ${resume.path}:`, err);
      });
    }
  }
}
