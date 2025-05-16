import { Uuid } from '@common/types/common.type';
import { AbstractEntity } from '@database/entities/abstract.entity';
import { OrganizationEntity } from '@modules/organization/entities/organization.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('candidate', { schema: 'public' })
export class CandidateEntity extends AbstractEntity {
  constructor(data?: Partial<CandidateEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_candidate_id',
  })
  id!: Uuid;

  @Column('uuid', { name: 'organization_id', nullable: true })
  organizationId?: Uuid;

  @Column('uuid', { name: 'created_by', nullable: true })
  createdBy?: Uuid | null;

  @Column('varchar', { length: 255, name: 'full_name' })
  fullName!: string;

  @Column('varchar', { length: 255, unique: true })
  email!: string;

  @Column('varchar', { length: 50, name: 'phone_number', unique: true })
  phoneNumber!: string;

  @Column('varchar', { length: 500, nullable: true })
  address?: string;

  @Column('varchar', { length: 20, nullable: true })
  gender?: string;

  @Column('date', { name: 'date_of_birth', nullable: true })
  dateOfBirth?: Date;

  @Column('varchar', { name: 'linkedin_profile', length: 255, nullable: true })
  linkedinProfile?: string;

  @Column('varchar', { name: 'portfolio_url', length: 255, nullable: true })
  portfolioUrl?: string;

  @Column('jsonb', { nullable: true })
  education?: Array<{
    school: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
  }>;

  @Column('jsonb', { name: 'work_experience', nullable: true })
  workExperience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;

  @Column('varchar', { array: true, nullable: true })
  skills?: string[];

  @Column('varchar', { array: true, nullable: true })
  languages?: string[];

  @Column('varchar', { name: 'certifications', array: true, nullable: true })
  certifications?: string[];

  @Column('text', { nullable: true })
  summary?: string;

  @Column('varchar', { name: 'resume_url', length: 255, nullable: true })
  resumeUrl?: string;

  @Column('varchar', { nullable: true })
  source?: 'UPLOAD' | 'LINKEDIN' | 'REFERRAL' | 'OTHER';

  @Column('text', { nullable: true })
  notes?: string;

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({
    name: 'organization_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_candidate_organization_id',
  })
  organization?: Relation<OrganizationEntity>;

  @JoinColumn({
    name: 'created_by',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_candidate_created_by',
  })
  @ManyToOne(() => UserEntity)
  createdByUser: UserEntity;
}
