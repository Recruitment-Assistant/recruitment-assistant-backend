import { PHONE_NUMBER_FORMAT } from '@common/constants/app.constant';
import {
  ClassFieldOptional,
  EmailField,
  EnumFieldOptional,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '@common/decorators/field.decorators';
import {
  SALARY_CURRENCY,
  SALARY_INTERVAL,
} from '@modules/job/domain/constants/job.constant';
import { Matches } from 'class-validator';

export class ExpectedSalaryDto {
  @NumberFieldOptional()
  salary?: number;

  @EnumFieldOptional(() => SALARY_CURRENCY, { default: SALARY_CURRENCY.USD })
  currency?: SALARY_CURRENCY;

  @EnumFieldOptional(() => SALARY_INTERVAL, {
    default: SALARY_INTERVAL.Monthly,
  })
  interval?: SALARY_INTERVAL;
}

export class ApplyJobDto {
  @StringField()
  full_name: string;

  @EmailField()
  email: string;

  @StringFieldOptional()
  @Matches(PHONE_NUMBER_FORMAT, { message: 'Phone number invalid' })
  phone_number: string;

  @ClassFieldOptional(() => ExpectedSalaryDto)
  expected_salary?: ExpectedSalaryDto;

  @StringFieldOptional()
  cover_letter: string;
}
