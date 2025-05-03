import { Uuid } from '@common/types/common.type';
import { AbstractEntity } from '@database/entities/abstract.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserOrganizationEntity } from './user-organization.entity';

@Entity('organization', { schema: 'public' })
export class OrganizationEntity extends AbstractEntity {
  constructor(data?: Partial<OrganizationEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    primaryKeyConstraintName: 'PK_organization_id',
  })
  id!: Uuid;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  address!: string;

  @Column('varchar', { length: 255, nullable: true, name: 'logo_url' })
  logoUrl!: string | null;

  @Column('uuid', { name: 'created_by' })
  createdBy!: Uuid;

  @JoinColumn({
    name: 'created_by',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_organization_created_by',
  })
  @ManyToOne(() => UserEntity)
  createdByUser!: Relation<UserEntity>;

  @OneToMany(() => UserOrganizationEntity, (userOrg) => userOrg.organization)
  userOrganizations!: UserOrganizationEntity[];

  canUpdate(userId: Uuid) {
    return this.createdBy === userId;
  }
}
