import { Uuid } from '@/common/types/common.type';
import {
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@common/decorators/field.decorators';
import { BaseResDto } from '@common/dto/base.res.dto';
import { Expose } from 'class-transformer';

@Expose()
export class PositionResDto extends BaseResDto {
  @StringField()
  @Expose()
  title: string;

  @StringFieldOptional()
  @Expose()
  description?: string;

  @UUIDField({ name: 'organization_id' })
  @Expose()
  organizationId: Uuid;
}
