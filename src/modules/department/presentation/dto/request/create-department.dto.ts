import {
  StringField,
  StringFieldOptional,
} from '@common/decorators/field.decorators';
import { Uuid } from '@common/types/common.type';

export class CreateDepartmentDto {
  @StringField()
  code: string;

  @StringField()
  name: string;

  @StringFieldOptional()
  description?: string;

  organizationId: Uuid;
}
