import {
  BooleanField,
  ClassField,
  DateField,
  StringField,
} from '@common/decorators/field.decorators';
import { BaseResDto } from '@common/dto/base.res.dto';
import { BaseUserResDto } from '@shared/dto/base-user.res.dto';
import { Expose } from 'class-transformer';

@Expose()
export class OrganizationResDto extends BaseResDto {
  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  address: string;

  @StringField({ name: 'logo_url' })
  @Expose()
  logoUrl: string;

  @DateField({ name: 'joined_at' })
  @Expose()
  joinedAt: Date;

  @BooleanField({ name: 'is_owner' })
  @Expose()
  isOwner: boolean;

  @ClassField(() => BaseUserResDto, { name: 'created_by_user' })
  @Expose()
  createdByUser: BaseUserResDto;
}
