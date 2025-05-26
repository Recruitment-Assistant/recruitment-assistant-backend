import { EMPLOYMENT_TYPE, JOB_STATUS } from '@/common/constants/entity.enum';
import { Department } from '@/modules/department/domain/entities/department';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { Uuid } from '@common/types/common.type';
import { OrganizationEntity } from '@modules/organization/entities/organization.entity';
import { BaseEntity } from '@shared/entities/base-entity';

export interface SalaryRange {
  min?: number;
  max?: number;
  currency?: string;
  interval?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  bonus_eligible?: boolean;
  equity_offered?: boolean;
}

export class Job extends BaseEntity {
  constructor(data: Partial<Job>) {
    super(data);
    Object.assign(this, data);
  }

  title!: string;

  description!: string;

  requirements!: string;

  tags?: string[];

  location!: string;

  publishedAt?: Date;

  closedAt?: Date;

  status: JOB_STATUS = JOB_STATUS.DRAFT;

  quantity: number = 1;

  remoteEligible: boolean = false;

  applicantsCount: number = 0;

  employmentType!: EMPLOYMENT_TYPE;

  salaryRange?: SalaryRange;

  organizationId: Uuid;

  departmentId?: Uuid;

  createdBy!: Uuid;

  organization?: OrganizationEntity;

  department?: Department;

  creator?: UserEntity;
}
