import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ApplicationEntity } from '../entities/application.entity';

@Injectable()
export class ApplicationRepository extends Repository<ApplicationEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ApplicationEntity, dataSource.createEntityManager());
  }
}
