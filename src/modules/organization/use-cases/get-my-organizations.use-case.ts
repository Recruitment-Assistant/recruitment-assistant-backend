import { Uuid } from '@common/types/common.type';
import { Injectable } from '@nestjs/common';
import { UserOrganizationRepository } from '../repositories/user-organization.repository';

@Injectable()
export class GetMyOrganizationsUseCase {
  constructor(
    private readonly userOrganizationRepository: UserOrganizationRepository,
  ) {}

  async execute(userId: Uuid) {
    const organizations =
      await this.userOrganizationRepository.findByUserId(userId);

    return organizations;
  }
}
