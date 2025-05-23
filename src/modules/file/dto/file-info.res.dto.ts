import { NumberField, StringField } from '@common/decorators/field.decorators';
import { Expose } from 'class-transformer';

export class FileInfoResDto {
  @Expose({ name: 'public_id' })
  @StringField({ name: 'public_id' })
  public_id: string;

  @Expose({ name: 'original_filename' })
  @StringField({ name: 'original_filename' })
  original_filename: string;

  @StringField()
  format: string;

  @Expose({ name: 'resource_type' })
  @StringField({ name: 'resource_type' })
  resource_type: string;

  @StringField()
  url: string;

  @NumberField()
  bytes: number;
}
