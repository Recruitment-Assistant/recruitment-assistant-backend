import { Uuid } from '@common/types/common.type';

export class BaseEntity {
  id: Uuid;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(data: Partial<BaseEntity> = {}) {
    Object.assign(this, data);
  }
}
