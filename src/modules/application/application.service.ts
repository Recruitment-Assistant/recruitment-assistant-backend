import { OffsetPaginationDto } from '@common/dto/offset-pagination/offset-pagination.dto';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { EventService } from '@common/events/event.service';
import { ICurrentUser } from '@common/interfaces';
import { Uuid } from '@common/types/common.type';
import { FileEntity } from '@database/entities/file.entity';
import { AnalysisResumeCommand } from '@modules/application/commands/analysis-resume.command';
import { CandidateEntity } from '@modules/candidate/entities/candidate.entity';
import { CandidateRepository } from '@modules/candidate/repositories/candidate.repository';
import { FileInfoResDto } from '@modules/file/dto/file-info.res.dto';
import { FileService } from '@modules/file/file.service';
import { GetJobByIdEvent } from '@modules/job/domain/events/get-job-by-id.event';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import * as fs from 'fs';
import PdfParse from 'pdf-parse';
import { Observable, Subject } from 'rxjs';
import { FindManyOptions, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RESUME_ANALYZER_PORT, RESUME_PARSER_PORT } from './constants';
import { generateJDtext } from './constants/prompt-analysis-resume.constant';
import { FilterApplicationDto } from './dto/filter-application.dto';
import { ApplicationEntity } from './entities/application.entity';
import { ResumeAnalysisLogEntity } from './entities/resume-analysis-log.entity';
import { ResumeAnalyzerPort } from './ports/resume-analyzer.port';
import { ResumeParserPort } from './ports/resume-parser.port';
import { ApplicationRepository } from './repositories/application.repository';
import { ResumeAnalysisLogRepository } from './repositories/resume-analysis-log.repository';
import { AnalysisResult } from './types/analysis-result.dto';
import { ResumeData } from './types/resume-parsed.dto';
import { ISSEMessage } from './types/sse-message.interface';

@Injectable()
export class ApplicationService {
  private streams = new Map<string, Subject<ISSEMessage>>();

  constructor(
    private readonly candidateRepository: CandidateRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly resumeLogRepository: ResumeAnalysisLogRepository,
    private readonly eventService: EventService,
    @Inject(RESUME_PARSER_PORT)
    private readonly parser: ResumeParserPort,
    @Inject(RESUME_ANALYZER_PORT)
    private readonly analyzer: ResumeAnalyzerPort,
    private readonly fileService: FileService,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
  ) {}

  async saveAnalysisResults({
    resumeData,
    analysisResult,
    jobId,
    resumeText,
    resume,
    user,
  }: {
    resumeData: ResumeData;
    analysisResult: AnalysisResult;
    jobId: Uuid;
    resumeText: string;
    resume: FileEntity;
    user: ICurrentUser;
  }) {
    const candidateId = uuidv4() as Uuid;
    const applicationId = uuidv4() as Uuid;

    await this.candidateRepository.save(
      new CandidateEntity({
        id: candidateId,
        organizationId: user.organizationId,
        createdBy: user.id,
        fullName: resumeData.full_name,
        email: resumeData.email,
        phoneNumber: resumeData.phone,
        address: resumeData.address,
        linkedinProfile: resumeData.linkedin,
        education: resumeData.education?.map((e) => ({
          school: e.school,
          degree: e.degree,
          major: e.major,
          startDate: e.start_date,
          endDate: e.end_date,
        })),
        workExperience: resumeData.work_experience?.map((w) => ({
          company: w.company,
          position: w.position,
          startDate: w.start_date,
          endDate: w.end_date,
          description: w.description,
        })),
        skills: resumeData.skills,
        languages: resumeData.languages,
        certifications: resumeData.certifications,
        summary: resumeData.summary,
        source: 'UPLOAD',
        resume: resume,
      }),
    );

    await this.applicationRepository.save(
      new ApplicationEntity({
        id: applicationId,
        organizationId: user.organizationId,
        candidateId,
        jobId,
        resume: resume,
        rawResumeText: resumeText,
        screeningScore: analysisResult.score_resume_match,
        scoreResumeMatch: analysisResult.score_resume_match,
        screeningNote: analysisResult.feedback,
        appliedAt: new Date(),
        source: 'UPLOAD',
        status: 'NEW',
        currentStage: 'SCREENING',
      }),
    );

    await this.resumeLogRepository.save(
      new ResumeAnalysisLogEntity({
        id: uuidv4() as Uuid,
        applicationId,
        aiSummary: analysisResult.ai_summary,
        selected: analysisResult.selected,
        scoreResumeMatch: analysisResult.score_resume_match,
        experienceLevel: analysisResult.experience_level,
        feedback: analysisResult.feedback,
        matchingSkills: analysisResult.matching_skills,
        missingSkills: analysisResult.missing_skills,
        analyzedAt: new Date(),
      }),
    );

    return { candidateId, applicationId };
  }

  async handleAnalysisOneResume(
    command: AnalysisResumeCommand,
    analysisId: string,
  ) {
    const stream = this.streams.get(analysisId);
    if (!stream) {
      throw new Error('No stream found for analysisId');
    }

    const { resumeFile, user, jobId } = command;

    const sendProgress = (data: any, event?: string) => {
      stream.next({ id: Date.now().toString(), event, data });
    };

    try {
      const job =
        command.job ??
        (await this.eventService.emitAsync(new GetJobByIdEvent(jobId)));

      const dataBuffer = fs.readFileSync(resumeFile.path);
      resumeFile.buffer = resumeFile.buffer ?? dataBuffer;
      const pdfData = await PdfParse(dataBuffer);
      const resumeText = pdfData.text;

      sendProgress({ type: 'reading', payload: resumeText }, 'reading');
      const resumeUpload: FileInfoResDto =
        await this.fileService.handleFileUpload(resumeFile);
      sendProgress({ type: 'extracting', payload: resumeUpload }, 'extracting');

      const resumeData = await this.parser.parse(dataBuffer);

      sendProgress({ type: 'analyzing', payload: resumeData }, 'analyzing');
      const JD_TEXT = generateJDtext(job.description, job.requirements);
      const analysisResult = await this.analyzer.analyze(JD_TEXT, resumeText);

      sendProgress({ type: 'storing', payload: analysisResult }, 'done');
      const result = await this.saveAnalysisResults({
        analysisResult,
        resumeData,
        jobId,
        resumeText,
        resume: resumeUpload,
        user,
      });

      sendProgress({ type: 'complete', payload: result }, 'complete');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      sendProgress({ type: 'failed', payload: errorMessage }, 'error');
      stream.error(error);
    } finally {
      if (resumeFile.path && !resumeFile.buffer) {
        fs.unlink(resumeFile.path, (err) => {
          if (err)
            console.error(`Failed to delete file ${resumeFile.path}:`, err);
        });
      }
      this.streams.delete(analysisId);
    }
  }

  createStream(analysisId: string): Observable<ISSEMessage> {
    const stream = new Subject<ISSEMessage>();
    this.streams.set(analysisId, stream);
    return stream.asObservable();
  }

  async getListApplication(query: FilterApplicationDto) {
    const filterOptions: FindManyOptions<ApplicationEntity> = {
      where: {
        organizationId: query.ogranizationId,
        id: query.id ? In(query.id) : undefined,
        jobId: query.jobId ? In(query.jobId) : undefined,
      },
    };

    filterOptions.skip = query.page ? (query.page - 1) * query.limit : 0;
    filterOptions.take = query.limit;
    filterOptions.order = { createdAt: 'DESC' };

    filterOptions.relations = {
      candidate: true,
      resumeLog: true,
    };

    const [applications, totalRecords] =
      await this.applicationRepository.findAndCount(filterOptions);

    const meta = new OffsetPaginationDto(totalRecords, query);
    return new OffsetPaginatedDto(applications, meta);
  }
}
