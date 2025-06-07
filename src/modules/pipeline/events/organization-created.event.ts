import { IEvent } from '@common/events/event.interface';
import { Uuid } from '@common/types/common.type';

export class OrganizationCreatedEvent implements IEvent<Uuid> {
  name = 'created';
  scope = 'organization';
  constructor(public readonly payload: Uuid) {}
}
