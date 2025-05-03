import {
  StringField,
  StringFieldOptional,
} from '@common/decorators/field.decorators';
import { Uuid } from '@common/types/common.type';
import { Expose } from 'class-transformer';

export class CreateOrganizationDto {
  @StringField()
  name: string;

  @StringField()
  address: string;

  @StringFieldOptional({ name: 'logo_url' })
  @Expose({ name: 'logo_url' })
  logoUrl?: string;

  createdBy: Uuid;
}
