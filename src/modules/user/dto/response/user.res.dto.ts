import { ROLE } from '@common/constants/entity.enum';
import {
  DateFieldOptional,
  StringField,
  StringFieldOptional,
} from '@common/decorators/field.decorators';
import { BaseResDto } from '@common/dto/base.res.dto';
import { RoleEntity } from '@modules/role/entities/role.entity';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
@Expose({ toPlainOnly: true })
export class UserResDto extends BaseResDto {
  @StringField()
  @Expose()
  email: string;

  @Exclude()
  password: string;

  @StringField()
  @Expose()
  name: string;

  @StringFieldOptional()
  @Expose()
  avatar: string;

  @DateFieldOptional({ name: 'date_of_birth' })
  @Expose()
  dateOfBirth: Date;

  @StringField()
  @Expose()
  @Transform(({ value }) => (value === 0 ? 'MALE' : 'FEMALE'))
  gender: string;

  @StringField({ isArray: true, each: true })
  @Transform(({ obj }) => {
    return obj.roles && Array.isArray(obj.roles)
      ? obj.roles.map((item: RoleEntity) => item.name)
      : [];
  })
  @Expose()
  roles: ROLE[];
}
