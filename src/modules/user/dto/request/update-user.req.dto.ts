import { PHONE_NUMBER_FORMAT } from '@common/constants/app.constant';
import { GENDER } from '@common/constants/entity.enum';
import {
  DateFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
  URLFieldOptional,
} from '@common/decorators/field.decorators';
import { Expose } from 'class-transformer';
import { Matches } from 'class-validator';

export class UpdateUserReqDto {
  @URLFieldOptional()
  readonly avatar?: string;

  @StringFieldOptional({ name: 'phone_number' })
  @Expose({ name: 'phone_number' })
  @Matches(PHONE_NUMBER_FORMAT, {
    message: 'phone_number must be a valid phone number',
  })
  phoneNumber?: string;

  @StringFieldOptional()
  name?: string;

  @DateFieldOptional({ name: 'date_of_birth' })
  @Expose({ name: 'date_of_birth' })
  dateOfBirth?: Date;

  @EnumFieldOptional(() => GENDER, { default: GENDER.MALE })
  gender?: GENDER;
}
