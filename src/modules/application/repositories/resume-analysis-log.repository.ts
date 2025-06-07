import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ResumeAnalysisEntity } from '../entities/resume-analysis.entity';

@Injectable()
export class ResumeAnalysisLogRepository extends Repository<ResumeAnalysisEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ResumeAnalysisEntity, dataSource.createEntityManager());
  }
}
