import { Uuid } from '@common/types/common.type';
import { AbstractEntity } from '@database/entities/abstract.entity';
import { OrganizationEntity } from '@modules/organization/entities/organization.entity';
import { StageEntity } from '@modules/stage/entities/stage.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('pipeline', { schema: 'public' })
@Index('IDX_pipeline_organization_id', ['organization_id'])
@Index('UQ_pipeline_organization_name', ['organization_id', 'name'], {
  where: '"deleted_at" IS NULL',
  unique: true,
})
export class PipelineEntity extends AbstractEntity {
  constructor(data?: Partial<PipelineEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    primaryKeyConstraintName: 'PK_pipeline_id',
  })
  id!: Uuid;

  @Column('uuid', { name: 'organization_id' })
  organization_id!: Uuid;

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({
    name: 'organization_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_pipeline_organization_id',
  })
  organization!: Relation<OrganizationEntity>;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('text', { nullable: true })
  description?: string | null;

  @Column('boolean', { name: 'is_default', default: true })
  is_default!: boolean;

  @OneToMany(() => StageEntity, (stage) => stage.pipeline, { cascade: true })
  stages!: Relation<StageEntity>[];
}
