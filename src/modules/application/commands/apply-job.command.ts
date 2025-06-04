import { EventService } from '@common/events/event.service';
import { Uuid } from '@common/types/common.type';
import { ApplicationService } from '@modules/application/application.service';
import { ApplyJobDto } from '@modules/application/dto/apply.job.dto';
import { ApplicationRepository } from '@modules/application/repositories/application.repository';
import { ResumeAnalysisLogRepository } from '@modules/application/repositories/resume-analysis-log.repository';
import { CandidateEntity } from '@modules/candidate/entities/candidate.entity';
import { CandidateRepository } from '@modules/candidate/repositories/candidate.repository';
import { FileService } from '@modules/file/file.service';
import { Job } from '@modules/job/domain/entities/job';
import { GetJobByIdEvent } from '@modules/job/domain/events/get-job-by-id.event';
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import fs from 'fs';
import { ApplicationEntity } from '../entities/application.entity';
import { ResumeAnalysisLogEntity } from '../entities/resume-analysis-log.entity';
import { IPayloadCreateApplication } from '../types';

export class ApplyJobCommand implements ICommand {
  constructor(
    public readonly jobId: Uuid,
    public readonly dto: ApplyJobDto,
    public readonly resume: Express.Multer.File,
    public job?: Job,
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
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(command: ApplyJobCommand) {
    const { resume, jobId, dto } = command;
    try {
      const job =
        command.job ??
        (await this.eventService.emitAsync(new GetJobByIdEvent(jobId)));
      dto.organizationId = job.organizationId;

      const { candidate, resumeText } =
        await this.getOrCreateCandidate(command);

      const applicationExist = await this.applicationRepository.findOneBy({
        candidateId: candidate?.id,
        jobId,
      });

      if (applicationExist) {
        return;
      }

      const analysisResult = await this.applicationService.analyzeResume(
        job,
        resumeText,
      );

      await this.saveApplication({
        analysisResult,
        jobId,
        resumeText,
        resume: candidate.resume,
        organizationId: dto.organizationId,
        candidateId: candidate.id,
      });
    } catch (error) {
      console.error('Error applying for job:', error);
    } finally {
      if (resume && resume.path && !resume.buffer) {
        fs.unlink(resume.path, (err) => {
          if (err) console.error(`Failed to delete file ${resume.path}:`, err);
        });
      }
    }
  }

  private async getOrCreateCandidate(command: ApplyJobCommand) {
    const { dto, resume } = command;

    const existing = await this.candidateRepository.findOneBy({
      email: dto.email,
      organizationId: dto.organizationId,
    });

    if (existing) {
      return { candidate: existing, resumeText: null };
    }

    const { resumeText, resumeData, resumeUpload } =
      await this.applicationService.parseResume(resume);

    const newCandidate = await this.candidateRepository.createOrUpdate(
      new CandidateEntity({
        organizationId: dto.organizationId,
        fullName: resumeData.full_name,
        email: resumeData.email,
        phoneNumber: dto.phone_number || resumeData.phone,
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
        resume: resumeUpload,
      }),
    );

    return { candidate: newCandidate, resumeText };
  }

  private async saveApplication(payload: IPayloadCreateApplication) {
    const {
      analysisResult,
      jobId,
      resumeText,
      resume,
      organizationId,
      candidateId,
    } = payload;

    const applicationSaved = await this.applicationRepository.upsert(
      new ApplicationEntity({
        organizationId,
        candidateId,
        jobId,
        resume,
        rawResumeText: resumeText,
        screeningScore: analysisResult.score_resume_match,
        scoreResumeMatch: analysisResult.score_resume_match,
        screeningNote: analysisResult.feedback,
        appliedAt: new Date(),
        source: 'UPLOAD',
        status: 'NEW',
        currentStage: 'SCREENING',
      }),
      { conflictPaths: ['candidateId', 'jobId'] },
    );

    await this.resumeLogRepository.save(
      new ResumeAnalysisLogEntity({
        applicationId: applicationSaved.identifiers[0].id as Uuid,
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
  }
}
