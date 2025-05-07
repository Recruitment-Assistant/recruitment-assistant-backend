import { OrganizationEntity } from '@/modules/organization/entities/organization.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { Uuid } from '@common/types/common.type';
import { AbstractEntity } from '@database/entities/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('department', { schema: 'public' })
@Index('UQ_department_organization_code', ['organization', 'code'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class DepartmentEntity extends AbstractEntity {
  constructor(data?: Partial<DepartmentEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_department_id',
  })
  id: Uuid;

  @Column('varchar', { length: 50 })
  code: string;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('uuid', { name: 'organization_id' })
  organizationId: Uuid;

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({
    name: 'organization_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_department_organization_id',
  })
  organization: OrganizationEntity;

  @Column('uuid', { name: 'head_id', nullable: true })
  headId?: Uuid;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({
    name: 'head_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_department_head_id',
  })
  head?: UserEntity;
}
