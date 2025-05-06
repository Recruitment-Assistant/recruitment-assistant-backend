import {
  StringField,
  StringFieldOptional,
} from '@/common/decorators/field.decorators';
import { Uuid } from '@/common/types/common.type';

export class CreatePositionDto {
  @StringField()
  title: string;

  @StringFieldOptional()
  description?: string;

  organizationId: Uuid;
}
