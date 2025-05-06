import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { OrganizationEntity } from '@/modules/organization/entities/organization.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('position', { schema: 'public' })
export class PositionEntity extends AbstractEntity {
  constructor(data?: Partial<PositionEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_position_id',
  })
  id!: Uuid;

  @Column('varchar', { length: 255 })
  title!: string;

  @Column('varchar', { nullable: true })
  description?: string;

  @Column('uuid', { name: 'organization_id' })
  organizationId!: Uuid;

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({
    name: 'organization_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_position_organization_id',
  })
  organization!: Relation<OrganizationEntity>;
}
