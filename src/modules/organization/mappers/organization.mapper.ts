import { Mapper } from '@core/domain/mapper';
import { plainToInstance } from 'class-transformer';
import { OrganizationResDto } from '../dto/response/organization.res.dto';
import { OrganizationEntity } from '../entities/organization.entity';

export class OrganizationMapper implements Mapper<OrganizationEntity> {
  static toDto(t: OrganizationEntity): OrganizationResDto {
    return plainToInstance(OrganizationResDto, t, {
      excludeExtraneousValues: true,
    });
  }

  static toDtos(t: OrganizationEntity[]): OrganizationResDto[] {
    return plainToInstance(OrganizationResDto, t, {
      excludeExtraneousValues: true,
    });
  }
}
