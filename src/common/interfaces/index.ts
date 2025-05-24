import { ROLE } from '@common/constants/entity.enum';
import { Uuid } from '@common/types/common.type';

export interface ICurrentUser {
  id: Uuid;
  roles: ROLE[];
  sessionId?: Uuid;
  permissions: string[];
  name: string;
  avatar?: string;
  email: string;
  organizationId?: Uuid;
}
