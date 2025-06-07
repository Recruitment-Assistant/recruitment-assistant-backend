import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PipelineEntity } from '../entities/pipeline.entity';

@Injectable()
export class PipelineRepository extends Repository<PipelineEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PipelineEntity, dataSource.createEntityManager());
  }
}
