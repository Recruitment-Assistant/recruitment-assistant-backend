import {
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@/common/decorators/field.decorators';
import { Uuid } from '@/common/types/common.type';
import { BaseResDto } from '@common/dto/base.res.dto';
import { Expose } from 'class-transformer';

@Expose()
export class DepartmentResDto extends BaseResDto {
  @StringField()
  @Expose()
  code: string;

  @StringField()
  @Expose()
  name: string;

  @StringFieldOptional()
  @Expose()
  description?: string;

  @UUIDField({ name: 'organization_id' })
  @Expose()
  organizationId: Uuid;
}
