import { EMPLOYMENT_TYPE, JOB_STATUS } from '@/common/constants/entity.enum';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { OrganizationEntity } from '@/modules/organization/entities/organization.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { ApplicationEntity } from '@modules/application/entities/application.entity';
import { DepartmentEntity } from '@modules/department/infrastructure/database/entities/department.entity';
import { PipelineEntity } from '@modules/pipeline/entities/pipeline.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('job', { schema: 'public' })
export class JobEntity extends AbstractEntity {
  constructor(data?: Partial<JobEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_job_id',
  })
  id!: Uuid;

  @Column('uuid', { name: 'organization_id' })
  organizationId!: Uuid;

  @Column('uuid', { name: 'department_id' })
  departmentId!: Uuid;

  @Column('uuid')
  pipeline_id!: Uuid;

  @Column('uuid', { name: 'created_by' })
  createdBy!: Uuid;

  @Column('varchar', { length: 255 })
  title!: string;

  @Column('text')
  description!: string;

  @Column('text')
  requirements!: string;

  @Column('varchar', { array: true, nullable: true })
  tags?: string[];

  @Column('varchar')
  location!: string;

  @Column('timestamptz', { name: 'published_at', nullable: true })
  publishedAt?: Date;

  @Column('timestamptz', { name: 'closed_at', nullable: true })
  closedAt?: Date;

  @Column('varchar', { default: JOB_STATUS.DRAFT })
  status!: JOB_STATUS;

  @Column('integer', { default: 1 })
  quantity!: number;

  @Column('boolean', { name: 'remote_eligible', default: false })
  remoteEligible!: boolean;

  @Column('varchar', { name: 'employment_type' })
  employmentType!: EMPLOYMENT_TYPE;

  @Column('jsonb', { name: 'salary_range', nullable: true })
  salaryRange?: Record<string, any>;

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({
    name: 'organization_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_job_organization_id',
  })
  organization?: OrganizationEntity;

  @ManyToOne(() => DepartmentEntity)
  @JoinColumn({
    name: 'department_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_job_department_id',
  })
  department?: DepartmentEntity;

  @ManyToOne(() => PipelineEntity)
  @JoinColumn({
    name: 'pipeline_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_job_pipeline_id',
  })
  pipeline?: Relation<PipelineEntity>;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'created_by',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_job_created_by',
  })
  creator!: UserEntity;

  @OneToMany(() => ApplicationEntity, (application) => application.job)
  applications?: ApplicationEntity[];
}
