import { Mapper } from '@/core/domain/mapper';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OrganizationResDto } from '../dto/response/organization.res.dto';
import { UserOrganizationEntity } from '../entities/user-organization.entity';

@Injectable()
export class UserOrganizationMapper implements Mapper<UserOrganizationEntity> {
  static toDto(entity: UserOrganizationEntity): OrganizationResDto {
    return plainToInstance(
      OrganizationResDto,
      {
        id: entity.organization.id,
        name: entity.organization.name,
        address: entity.organization.address,
        logoUrl: entity.organization.logoUrl,
        isOwner: entity.isOwner,
        joinedAt: entity.joinedAt,
        createdByUser: entity.organization?.createdByUser,
      },
      { excludeExtraneousValues: true },
    );
  }

  static toDtos(entities: UserOrganizationEntity[]): OrganizationResDto[] {
    return entities.map((e) => this.toDto(e));
  }
}
