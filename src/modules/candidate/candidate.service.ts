import { Uuid } from '@common/types/common.type';
import { CandidateEntity } from '@modules/candidate/entities/candidate.entity';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { CandidateRepository } from './repositories/candidate.repository';

@Injectable()
export class CandidateService {
  constructor(private readonly candidateRepository: CandidateRepository) {}

  async createOrUpdate(dto: CreateCandidateDto) {
    const candidateId = uuidv4() as Uuid;
    const newCandidate = new CandidateEntity({
      id: candidateId,
      organizationId: dto.organizationId,
      createdBy: dto.createdBy,
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
      linkedinProfile: dto.linkedinProfile,
      education: dto.education?.map((e) => ({
        school: e.school,
        degree: e.degree,
        major: e.major,
        startDate: e.startDate,
        endDate: e.endDate,
      })),
      workExperience: dto.workExperience?.map((w) => ({
        company: w.company,
        position: w.position,
        startDate: w.startDate,
        endDate: w.endDate,
        description: w.description,
      })),
      skills: dto.skills,
      languages: dto.languages,
      certifications: dto.certifications,
      summary: dto.summary,
      source: 'UPLOAD',
      resume: dto.resume,
    });

    await this.candidateRepository.upsert(newCandidate, {
      conflictPaths: ['organizationId', 'email'],
    });
    return newCandidate;
  }
}
