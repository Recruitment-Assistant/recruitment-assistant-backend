import { UserEntity } from '@/modules/user/entities/user.entity';
import { Uuid } from '@common/types/common.type';
import { AbstractEntity } from '@database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';

@Entity('user_organization', { schema: 'public' })
@Unique('UQ_user_organization_user_id_organization_id', [
  'userId',
  'organizationId',
])
export class UserOrganizationEntity extends AbstractEntity {
  constructor(data?: Partial<UserOrganizationEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    primaryKeyConstraintName: 'PK_user_organization_id',
  })
  id!: Uuid;

  @Column('uuid', { name: 'user_id' })
  userId!: Uuid;

  @Column('uuid', { name: 'organization_id' })
  organizationId!: Uuid;

  @Column({ name: 'is_owner', default: false })
  isOwner: boolean = false;

  @Column('timestamptz', { name: 'joined_at', nullable: true })
  joinedAt!: Date | null;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_user_organization_user_id',
  })
  user!: Relation<UserEntity>;

  @ManyToOne(() => OrganizationEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'organization_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_user_organization_organization_id',
  })
  organization!: OrganizationEntity;
}
