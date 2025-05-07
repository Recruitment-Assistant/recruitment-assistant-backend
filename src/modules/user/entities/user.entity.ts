import { UserOrganizationEntity } from '@/modules/organization/entities/user-organization.entity';
import { GENDER } from '@common/constants/entity.enum';
import { Uuid } from '@common/types/common.type';
import { hashPassword as hashPass } from '@common/utils/password.util';
import { AbstractEntity } from '@database/entities/abstract.entity';
import { PermissionEntity } from '@modules/permission/entities/permission.entity';
import { RoleEntity } from '@modules/role/entities/role.entity';
import { SessionEntity } from '@modules/session/entities/session.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('user', { schema: 'public' })
export class UserEntity extends AbstractEntity {
  constructor(data?: Partial<UserEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_user_id' })
  id!: Uuid;

  @Column()
  @Index('UQ_user_email', { where: '"deleted_at" IS NULL', unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ name: 'phone_number' })
  phoneNumber?: string;

  @Column({ length: 50, nullable: true })
  name: string;

  @Column({ length: 255, nullable: true })
  avatar: string;

  @Column('date', { name: 'date_of_birth', nullable: true })
  dateOfBirth?: Date;

  @Column('int', { default: GENDER.MALE })
  gender: GENDER;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive?: boolean;

  @Column({ name: 'is_confirmed', type: 'boolean', default: false })
  isConfirmed?: boolean;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Array<RoleEntity>;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions?: SessionEntity[];

  permissions?: Partial<PermissionEntity>[];

  @OneToMany(() => UserOrganizationEntity, (userOrg) => userOrg.user)
  userOrganizations?: Relation<UserOrganizationEntity>[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashPass(this.password);
    }
  }
}
