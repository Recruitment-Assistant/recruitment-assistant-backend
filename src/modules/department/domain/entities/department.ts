import { Uuid } from '@/common/types/common.type';
import { OrganizationEntity } from '@/modules/organization/entities/organization.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { BaseEntity } from '@shared/entities/base-entity';

export class Department extends BaseEntity {
  constructor(data: Partial<Department>) {
    super();
    Object.assign(this, data);
  }

  code!: string;

  name!: string;

  description?: string;

  organizationId!: Uuid;

  organization?: OrganizationEntity;

  headId?: Uuid;

  head?: UserEntity;

  isActive(): boolean {
    return this.deletedAt === null || this.deletedAt === undefined;
  }

  changeHead(newHead: UserEntity): void {
    this.head = newHead;
    this.headId = newHead.id;
    this.updatedAt = new Date();
  }

  updateDetails(params: {
    name?: string;
    code?: string;
    description?: string;
  }): void {
    if (params.name) this.name = params.name;
    if (params.code) this.code = params.code;
    if (params.description) this.description = params.description;
    this.updatedAt = new Date();
  }
}
