import { Uuid } from '@common/types/common.type';
import { AbstractEntity } from '@database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ApplicationEntity } from './application.entity';

@Entity('resume_analysis_log', { schema: 'public' })
export class ResumeAnalysisLogEntity extends AbstractEntity {
  constructor(data?: Partial<ResumeAnalysisLogEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_resume_analysis_log_id',
  })
  id!: Uuid;

  @Column('uuid', { name: 'application_id' })
  applicationId!: Uuid;

  @Column('jsonb', { name: 'ai_summary', nullable: true })
  aiSummary?: Record<string, any>;

  @Column('boolean', { nullable: true })
  selected?: boolean;

  @Column('integer', { name: 'score_resume_match', nullable: true })
  scoreResumeMatch?: number;

  @Column('varchar', { name: 'experience_level', nullable: true })
  experienceLevel?: 'junior' | 'mid' | 'senior';

  @Column('text', { nullable: true })
  feedback?: string;

  @Column('varchar', { array: true, name: 'matching_skills', nullable: true })
  matchingSkills?: string[];

  @Column('varchar', { array: true, name: 'missing_skills', nullable: true })
  missingSkills?: string[];

  @Column('integer', { name: 'learning_score', nullable: true })
  learningScore?: number;

  @Column('integer', { name: 'project_score', nullable: true })
  projectScore?: number;

  @Column('integer', { name: 'experience_score', nullable: true })
  experienceScore?: number;

  @Column('integer', { name: 'skill_score', nullable: true })
  skillScore?: number;

  @Column('timestamptz', { name: 'analyzed_at', default: () => 'now()' })
  analyzedAt!: Date;

  @ManyToOne(() => ApplicationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'application_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_resume_analysis_log_application_id',
  })
  application!: Relation<ApplicationEntity>;
}
