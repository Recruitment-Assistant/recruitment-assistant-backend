import { Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrganizationEntity } from '../entities/organization.entity';

@Injectable()
export class OrganizationRepository extends Repository<OrganizationEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(OrganizationEntity, dataSource.createEntityManager());
  }

  async findById(id: Uuid): Promise<OrganizationEntity> {
    return this.findOne({
      where: { id },
      relations: ['createdByUser'],
      select: {
        createdByUser: {
          id: true,
          email: true,
          avatar: true,
          name: true,
        },
      },
    });
  }
}
