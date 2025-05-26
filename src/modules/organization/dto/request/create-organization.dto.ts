import {
  StringField,
  StringFieldOptional,
} from '@common/decorators/field.decorators';
import { Uuid } from '@common/types/common.type';
import { Expose } from 'class-transformer';

export class CreateOrganizationDto {
  @StringField()
  name: string;

  @StringFieldOptional({ default: null })
  description: string;

  @StringField()
  address: string;

  @StringFieldOptional({ name: 'logo_url', default: null })
  @Expose({ name: 'logo_url' })
  logoUrl?: string;

  createdBy: Uuid;
}
