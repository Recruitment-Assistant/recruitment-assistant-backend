import {
  BooleanFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '@common/decorators/field.decorators';
import { Expose } from 'class-transformer';

@Expose()
export class SalaryRangeDto {
  @NumberFieldOptional()
  @Expose()
  min: number;

  @NumberFieldOptional()
  @Expose()
  max?: number;

  @StringFieldOptional({ default: 'VND' })
  @Expose()
  currency?: string;

  @StringFieldOptional({ default: 'monthly' })
  @Expose()
  interval?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';

  @BooleanFieldOptional()
  @Expose()
  bonus_eligible?: boolean;

  @BooleanFieldOptional()
  @Expose()
  equity_offered?: boolean;
}
