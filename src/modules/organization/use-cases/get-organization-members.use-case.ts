import { Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { UserOrganizationEntity } from '../entities/user-organization.entity';
import { UserOrganizationRepository } from '../repositories/user-organization.repository';

@Injectable()
export class GetOrganizationMembersUseCase {
  constructor(private readonly userOrgRepo: UserOrganizationRepository) {}

  async execute(orgId: Uuid): Promise<UserOrganizationEntity[]> {
    return this.userOrgRepo.findUsersByOrganizationId(orgId);
  }
}
