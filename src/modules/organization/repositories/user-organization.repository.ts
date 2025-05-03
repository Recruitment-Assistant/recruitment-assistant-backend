import { Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserOrganizationEntity } from '../entities/user-organization.entity';

@Injectable()
export class UserOrganizationRepository extends Repository<UserOrganizationEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserOrganizationEntity, dataSource.createEntityManager());
  }

  async addUserToOrganization(
    data: Partial<UserOrganizationEntity>,
  ): Promise<UserOrganizationEntity> {
    return this.save(data);
  }

  async removeUserFromOrganization(
    userId: Uuid,
    organizationId: Uuid,
  ): Promise<void> {
    await this.delete({ userId, organizationId });
  }

  async findUsersByOrganizationId(
    orgId: Uuid,
  ): Promise<UserOrganizationEntity[]> {
    return this.find({
      where: { organizationId: orgId },
      relations: ['user'],
      select: {
        user: {
          id: true,
          email: true,
          avatar: true,
          name: true,
        },
      },
    });
  }

  async findByUserId(userId: Uuid): Promise<UserOrganizationEntity[]> {
    return this.find({
      where: { userId },
      relations: {
        organization: {
          createdByUser: true,
        },
      },
      select: {
        organization: {
          id: true,
          name: true,
          address: true,
          logoUrl: true,
          createdByUser: {
            id: true,
            email: true,
            avatar: true,
            name: true,
          },
        },
      },
    });
  }
}
