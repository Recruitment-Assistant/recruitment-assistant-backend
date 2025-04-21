import { UUIDField } from '@common/decorators/field.decorators';
import { Uuid } from '@common/types/common.type';
import { Expose } from 'class-transformer';

export class AssignRoleReqDto {
  @UUIDField({ name: 'role_id' })
  @Expose({ name: 'role_id' })
  roleId: Uuid;
}
