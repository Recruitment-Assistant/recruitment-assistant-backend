import { Uuid } from '@common/types/common.type';
import { Injectable } from '@nestjs/common';
import { UserOrganizationRepository } from '../repositories/user-organization.repository';

@Injectable()
export class AddOrganizationMemberUseCase {
  constructor(private readonly userOrgRepo: UserOrganizationRepository) {}

  async execute(organizationId: Uuid, userId: Uuid): Promise<void> {
    const memberExist = await this.userOrgRepo.findOneBy({
      userId,
      organizationId,
    });

    if (memberExist) {
      return;
    }

    await this.userOrgRepo.save({
      userId,
      organizationId,
      isOwner: false,
      joinedAt: new Date(),
    });
  }
}
