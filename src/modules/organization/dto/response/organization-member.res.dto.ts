import {
  BooleanField,
  ClassField,
  DateField,
  UUIDField,
} from '@/common/decorators/field.decorators';
import { Uuid } from '@/common/types/common.type';
import { BaseUserResDto } from '@/shared/dto/base-user.res.dto';
import { Expose } from 'class-transformer';

@Expose()
export class OrganizationMemberResDto {
  @UUIDField({ name: 'user_id' })
  @Expose()
  userId: Uuid;

  @DateField({ name: 'joined_at' })
  @Expose()
  joinedAt: Date;

  @BooleanField({ name: 'is_owner' })
  @Expose()
  isOwner: boolean;

  @ClassField(() => BaseUserResDto)
  @Expose()
  user: BaseUserResDto;
}
