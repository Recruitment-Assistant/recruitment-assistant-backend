import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StageEntity } from '../entities/stage.entity';

@Injectable()
export class StageRepository extends Repository<StageEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(StageEntity, dataSource.createEntityManager());
  }
}
