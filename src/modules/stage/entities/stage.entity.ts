import { Uuid } from '@common/types/common.type';
import { AbstractEntity } from '@database/entities/abstract.entity';
import { PipelineEntity } from '@modules/pipeline/entities/pipeline.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('stage', { schema: 'public' })
@Index('IDX_stage_pipeline_id', ['pipeline_id'])
@Index('UQ_stage_pipeline_order', ['pipeline_id', 'stage_order'], {
  unique: true,
})
@Index('UQ_stage_pipeline_name', ['pipeline_id', 'name'], { unique: true })
export class StageEntity extends AbstractEntity {
  constructor(data?: Partial<StageEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    primaryKeyConstraintName: 'PK_stage_id',
  })
  id!: Uuid;

  @Column('uuid', { name: 'pipeline_id' })
  pipeline_id!: Uuid;

  @ManyToOne(() => PipelineEntity, (pipeline) => pipeline.stages)
  @JoinColumn({
    name: 'pipeline_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_stage_pipeline_id',
  })
  pipeline!: Relation<PipelineEntity>;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('integer', { name: 'stage_order' })
  stage_order!: number;

  @Column('integer', { name: 'sla_days', nullable: true })
  sla_days: number | null;

  @Column('boolean', { name: 'is_terminal', default: false })
  is_terminal!: boolean;
}
