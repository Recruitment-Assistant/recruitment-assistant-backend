import { EventService } from '@common/events/event.service';
import { Uuid } from '@common/types/common.type';
import { generateJDtext } from '@modules/application/constants/prompt-analysis-resume.constant';
import { Job } from '@modules/job/domain/entities/job';
import { GetJobByIdEvent } from '@modules/job/domain/events/get-job-by-id.event';
import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import PdfParse from 'pdf-parse';
import { RESUME_ANALYZER_PORT, RESUME_PARSER_PORT } from '../constants';
import { ResumeAnalyzerPort } from '../ports/resume-analyzer.port';
import { ResumeParserPort } from '../ports/resume-parser.port';

@Injectable()
export class UploadResumeByJobIdUseCase {
  constructor(
    private readonly eventService: EventService,
    @Inject(RESUME_PARSER_PORT)
    private readonly parser: ResumeParserPort,
    @Inject(RESUME_ANALYZER_PORT)
    private readonly analyzer: ResumeAnalyzerPort,
  ) {}
  async execute(jobId: Uuid, files: Array<Express.Multer.File>) {
    const job: Job = await this.eventService.emitAsync(
      new GetJobByIdEvent(jobId),
    );

    const resumeFile = files[0];

    const dataBuffer = fs.readFileSync(resumeFile.path);
    const pdfData = await PdfParse(dataBuffer);
    const resumeText = pdfData.text;
    const result1 = await this.parser.parse(dataBuffer);
    const JD_TEXT = generateJDtext(job.description, job.requirements);
    const result2 = await this.analyzer.analyze(JD_TEXT, resumeText);
    return { result1, result2 };
  }
}
