import { Uuid } from '@/common/types/common.type';
import { OrganizationEntity } from '@/modules/organization/entities/organization.entity';
import { BaseEntity } from '@shared/entities/base-entity';

export class Position extends BaseEntity {
  constructor(data: Partial<Position>) {
    super();
    Object.assign(this, data);
  }
  title!: string;

  description?: string;

  organizationId: Uuid;

  organization?: OrganizationEntity;
}
