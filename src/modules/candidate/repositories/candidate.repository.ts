import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CandidateEntity } from '../entities/candidate.entity';

@Injectable()
export class CandidateRepository extends Repository<CandidateEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CandidateEntity, dataSource.createEntityManager());
  }
}
