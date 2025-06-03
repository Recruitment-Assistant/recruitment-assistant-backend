import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CandidateEntity } from '../entities/candidate.entity';

@Injectable()
export class CandidateRepository extends Repository<CandidateEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CandidateEntity, dataSource.createEntityManager());
  }

  async createOrUpdate(candidate: CandidateEntity) {
    const candidateExisting = await this.findOne({
      where: {
        organizationId: candidate.organizationId,
        email: candidate.email,
      },
    });
    if (candidateExisting) {
      Object.assign(candidateExisting, candidate);
      return this.save(candidateExisting);
    } else {
      return this.save(candidate);
    }
  }
}
