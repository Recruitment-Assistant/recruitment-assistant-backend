import { ICurrentUser } from '@/common/interfaces';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { Optional } from '@common/utils/optional';
import { CreateOrganizationDto } from '@modules/organization/dto/request/create-organization.dto';
import { OrganizationEntity } from '@modules/organization/entities/organization.entity';
import { OrganizationRepository } from '@modules/organization/repositories/organization.repository';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserOrganizationRepository } from '../repositories/user-organization.repository';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly userOrganizationRepository: UserOrganizationRepository,
  ) {}

  async execute(dto: CreateOrganizationDto, currentUser: ICurrentUser) {
    dto.createdBy = currentUser.id;
    Optional.of(
      await this.organizationRepository.findOneBy({
        name: dto.name,
        createdBy: dto.createdBy,
      }),
    ).throwIfPresent(new ConflictException('Organization already exists'));

    const org = new OrganizationEntity(dto);
    const savedOrg = await this.organizationRepository.save(org);

    await this.userOrganizationRepository.upsert(
      {
        userId: dto.createdBy,
        organizationId: savedOrg.id,
        isOwner: true,
        joinedAt: new Date(),
      },
      ['userId', 'organizationId'],
    );

    savedOrg.createdByUser = currentUser as unknown as UserEntity;
    return savedOrg;
  }
}
