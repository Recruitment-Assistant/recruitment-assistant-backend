import { EMPLOYMENT_TYPE, JOB_STATUS } from '@common/constants/entity.enum';
import {
  BooleanFieldOptional,
  ClassFieldOptional,
  DateFieldOptional,
  EnumField,
  NumberField,
  StringField,
  StringFieldOptional,
  UUIDFieldOptional,
} from '@common/decorators/field.decorators';
import { Uuid } from '@common/types/common.type';
import { Expose } from 'class-transformer';
import { SalaryRangeDto } from '../salary-range.dto';

@Expose()
export class CreateJobDto {
  @StringField()
  @Expose()
  title: string;

  @StringField()
  @Expose()
  description: string;

  @StringField()
  @Expose()
  requirements: string;

  @StringFieldOptional({ isArray: true, each: true })
  @Expose()
  tags?: string[];

  @StringField()
  @Expose()
  location: string;

  @DateFieldOptional({ name: 'published_at' })
  @Expose({ name: 'published_at' })
  publishedAt?: Date;

  @DateFieldOptional({ name: 'closed_at' })
  @Expose({ name: 'closed_at' })
  closedAt?: Date;

  @EnumField(() => JOB_STATUS, { default: JOB_STATUS.DRAFT })
  @Expose()
  status: JOB_STATUS = JOB_STATUS.DRAFT;

  @NumberField({ default: 1 })
  @Expose()
  quantity: number = 1;

  @BooleanFieldOptional({ default: false, name: 'remote_eligible' })
  @Expose({ name: 'remote_eligible' })
  remoteEligible: boolean = false;

  @EnumField(() => EMPLOYMENT_TYPE, { name: 'employment_type' })
  @Expose({ name: 'employment_type' })
  employmentType: EMPLOYMENT_TYPE;

  @ClassFieldOptional(() => SalaryRangeDto, { name: 'salary_range' })
  @Expose({ name: 'salary_range' })
  salaryRange?: SalaryRangeDto;

  @UUIDFieldOptional({ name: 'department_id', default: null })
  @Expose({ name: 'department_id' })
  departmentId?: Uuid;

  organizationId: Uuid;

  createdBy: Uuid;
}
