import {
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@common/decorators/field.decorators';
import { Expose } from 'class-transformer';

@Expose()
export class BaseUserResDto {
  @UUIDField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  email: string;

  @StringFieldOptional()
  @Expose()
  avatar: string;
}
