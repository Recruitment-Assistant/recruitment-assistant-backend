import { UUIDField } from '@/common/decorators/field.decorators';
import { Uuid } from '@/common/types/common.type';
import { Expose } from 'class-transformer';

export class AddMemberDto {
  @UUIDField({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: Uuid;
}
