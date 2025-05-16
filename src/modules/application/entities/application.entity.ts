import { Uuid } from '@common/types/common.type';
import { AbstractEntity } from '@database/entities/abstract.entity';
import { CandidateEntity } from '@modules/candidate/entities/candidate.entity';
import { JobEntity } from '@modules/job/infrastructure/database/entities/job.entity';
import { OrganizationEntity } from '@modules/organization/entities/organization.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

@Entity('application', { schema: 'public' })
@Unique('UQ_candidate_id_job_id', ['candidateId', 'jobId'])
export class ApplicationEntity extends AbstractEntity {
  constructor(data?: Partial<ApplicationEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_application_id',
  })
  id!: Uuid;

  @Column('uuid', { name: 'organization_id', nullable: true })
  organizationId?: Uuid;

  @Column('uuid', { name: 'candidate_id' })
  candidateId!: Uuid;

  @Column('uuid', { name: 'job_id' })
  jobId!: Uuid;

  @Column('varchar', { nullable: true })
  source?: string;

  @Column('varchar', { name: 'resume_url' })
  resumeUrl!: string;

  @Column('text', { name: 'raw_resume_text', nullable: true })
  rawResumeText?: string;

  @Column('float', { name: 'screening_score', default: 0 })
  screeningScore!: number;

  @Column('text', { name: 'screening_note', nullable: true })
  screeningNote?: string;

  @Column('float', { name: 'final_score', nullable: true })
  finalScore?: number;

  @Column('integer', { name: 'score_resume_match', nullable: true })
  scoreResumeMatch?: number;

  @Column('varchar', { name: 'current_stage', nullable: true })
  currentStage?: string;

  @Column('varchar', { nullable: true })
  status?: string;

  @Column('decimal', { name: 'expected_salary', nullable: true })
  expectedSalary?: number;

  @Column('uuid', { name: 'referred_by', nullable: true })
  referredBy?: Uuid;

  @Column('timestamptz', { name: 'applied_at', default: () => 'now()' })
  appliedAt!: Date;

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({
    name: 'organization_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_application_organization_id',
  })
  organization?: Relation<OrganizationEntity>;

  @ManyToOne(() => CandidateEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'candidate_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_application_candidate_id',
  })
  candidate!: Relation<CandidateEntity>;

  @ManyToOne(() => JobEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'job_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_application_job_id',
  })
  job!: Relation<JobEntity>;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'referred_by',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_application_referred_by',
  })
  referrer?: Relation<UserEntity>;
}
