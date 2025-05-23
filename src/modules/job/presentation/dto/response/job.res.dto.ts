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
import { BaseResDto } from '@common/dto/base.res.dto';
import { Uuid } from '@common/types/common.type';
import { DepartmentResDto } from '@modules/department/presentation/dto/response/department.res.dto';
import { PositionResDto } from '@modules/position/presentation/dto/response/position.res.dto';
import { BaseUserResDto } from '@shared/dto/base-user.res.dto';
import { Expose } from 'class-transformer';
import { SalaryRangeDto } from '../salary-range.dto';

@Expose()
export class JobResDto extends BaseResDto {
  @StringField({ name: 'job_code' })
  @Expose()
  jobCode: string;

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
  @Expose()
  publishedAt?: Date;

  @DateFieldOptional({ name: 'closed_at' })
  @Expose()
  closedAt?: Date;

  @EnumField(() => JOB_STATUS, { default: JOB_STATUS.DRAFT })
  @Expose()
  status: JOB_STATUS = JOB_STATUS.DRAFT;

  @NumberField({ default: 1 })
  @Expose()
  quantity: number = 1;

  @BooleanFieldOptional({ default: false, name: 'remote_eligible' })
  @Expose()
  remoteEligible: boolean = false;

  @EnumField(() => EMPLOYMENT_TYPE, { name: 'employment_type' })
  @Expose()
  employmentType: EMPLOYMENT_TYPE;

  @ClassFieldOptional(() => SalaryRangeDto, { name: 'salary_range' })
  @Expose()
  salaryRange?: SalaryRangeDto;

  @UUIDFieldOptional({ name: 'department_id' })
  @Expose()
  departmentId?: Uuid;

  @UUIDFieldOptional({ name: 'position_id' })
  @Expose()
  positionId: Uuid;

  @UUIDFieldOptional({ name: 'organization_id' })
  @Expose()
  organizationId: Uuid;

  @UUIDFieldOptional({ name: 'created_by' })
  @Expose()
  createdBy: Uuid;

  @ClassFieldOptional(() => DepartmentResDto)
  @Expose()
  department: DepartmentResDto;

  @ClassFieldOptional(() => PositionResDto)
  @Expose()
  position: PositionResDto;

  @ClassFieldOptional(() => BaseUserResDto)
  @Expose()
  creator: BaseUserResDto;
}
