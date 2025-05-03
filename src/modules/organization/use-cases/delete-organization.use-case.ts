import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/organization.repository';

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(id: Uuid): Promise<void> {
    Optional.of(this.repository.findById(id)).throwIfNullable(
      new NotFoundException('Organization not found'),
    );

    await this.repository.softDelete(id);
  }
}
