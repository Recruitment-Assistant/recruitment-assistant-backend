import { EMPLOYMENT_TYPE, JOB_STATUS } from '@common/constants/entity.enum';
import {
  BooleanFieldOptional,
  ClassFieldOptional,
  DateFieldOptional,
  EnumField,
  NumberField,
  StringField,
  StringFieldOptional,
  UUIDField,
  UUIDFieldOptional,
} from '@common/decorators/field.decorators';
import { BaseResDto } from '@common/dto/base.res.dto';
import { Uuid } from '@common/types/common.type';
import { DepartmentResDto } from '@modules/department/presentation/dto/response/department.res.dto';
import { OrganizationResDto } from '@modules/organization/dto/response/organization.res.dto';
import { PipelineResDto } from '@modules/pipeline/dto/pipeline.res.dto';
import { BaseUserResDto } from '@shared/dto/base-user.res.dto';
import { Expose } from 'class-transformer';
import { SalaryRangeDto } from '../salary-range.dto';

@Expose()
export class JobResDto extends BaseResDto {
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

  @NumberField({ default: 0 })
  @Expose()
  applied_count: number = 0;

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

  @UUIDField()
  @Expose()
  pipeline_id: Uuid;

  @UUIDFieldOptional({ name: 'organization_id' })
  @Expose()
  organizationId: Uuid;

  @UUIDFieldOptional({ name: 'created_by' })
  @Expose()
  createdBy: Uuid;

  @ClassFieldOptional(() => OrganizationResDto)
  @Expose()
  organization: OrganizationResDto;

  @ClassFieldOptional(() => DepartmentResDto)
  @Expose()
  department: DepartmentResDto;

  @ClassFieldOptional(() => BaseUserResDto)
  @Expose()
  creator: BaseUserResDto;

  @ClassFieldOptional(() => PipelineResDto)
  @Expose()
  pipeline: PipelineResDto;
}
