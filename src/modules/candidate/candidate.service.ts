import { CandidateEntity } from '@modules/candidate/entities/candidate.entity';
import { Injectable } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { CandidateRepository } from './repositories/candidate.repository';

@Injectable()
export class CandidateService {
  constructor(private readonly candidateRepository: CandidateRepository) {}

  async createOrUpdate(dto: CreateCandidateDto) {
    const newCandidate = new CandidateEntity({
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

    return this.candidateRepository.createOrUpdate(newCandidate);
  }
}
