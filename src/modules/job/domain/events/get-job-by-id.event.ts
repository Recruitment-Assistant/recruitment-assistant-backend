import { IEvent } from '@common/events/event.interface';
import { Uuid } from '@common/types/common.type';

export class GetJobByIdEvent implements IEvent<Uuid> {
  scope = 'job';
  name = 'get-job-by-id';

  constructor(public readonly payload: Uuid) {}
}
