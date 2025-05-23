import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ResumeAnalysisLogEntity } from '../entities/resume-analysis-log.entity';

@Injectable()
export class ResumeAnalysisLogRepository extends Repository<ResumeAnalysisLogEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ResumeAnalysisLogEntity, dataSource.createEntityManager());
  }
}
