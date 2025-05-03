import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserOrganizationRepository } from '../repositories/user-organization.repository';

@Injectable()
export class RemoveOrganizationMemberUseCase {
  constructor(private readonly userOrgRepo: UserOrganizationRepository) {}

  async execute(organizationId: Uuid, userId: Uuid): Promise<void> {
    Optional.of(
      await this.userOrgRepo.findOneBy({ userId, organizationId }),
    ).throwIfNullable(new NotFoundException('Member not found'));

    await this.userOrgRepo.removeUserFromOrganization(userId, organizationId);
  }
}
