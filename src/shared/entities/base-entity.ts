import { Uuid } from '@common/types/common.type';
import { v4 as uuidv4 } from 'uuid';

export class BaseEntity {
  id: Uuid;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(data: Partial<BaseEntity> = {}) {
    if (data.id) data.id = uuidv4() as Uuid;
    Object.assign(this, data);
  }
}
