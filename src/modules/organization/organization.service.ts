import { Uuid } from '@common/types/common.type';
import { Injectable } from '@nestjs/common';
import { UserOrganizationRepository } from './repositories/user-organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly userOrganizationRepository: UserOrganizationRepository,
  ) {}

  async isUserMemberOfOrganization(
    userId: Uuid,
    organizationId: Uuid,
  ): Promise<boolean> {
    const count = await this.userOrganizationRepository.count({
      where: { userId, organizationId },
    });
    return count > 0;
  }
}
