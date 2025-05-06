import { UUIDField } from '@/common/decorators/field.decorators';
import { Uuid } from '@/common/types/common.type';
import { Expose } from 'class-transformer';

export class SelectOrgDto {
  @UUIDField({ name: 'organization_id' })
  @Expose({ name: 'organization_id' })
  organizationId: Uuid;
}
