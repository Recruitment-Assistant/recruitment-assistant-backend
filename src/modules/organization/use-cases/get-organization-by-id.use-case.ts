import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationEntity } from '../entities/organization.entity';
import { OrganizationRepository } from '../repositories/organization.repository';

@Injectable()
export class GetOrganizationByIdUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(id: Uuid): Promise<OrganizationEntity> {
    const org = Optional.of(this.repository.findById(id))
      .throwIfNullable(new NotFoundException('Organization not found'))
      .get<OrganizationEntity>();

    return org;
  }
}
