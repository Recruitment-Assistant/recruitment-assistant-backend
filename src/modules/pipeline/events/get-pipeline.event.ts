import { IEvent } from '@common/events/event.interface';
import { Uuid } from '@common/types/common.type';

export class GetPipelineEvent implements IEvent<Uuid> {
  scope = 'pipeline';
  name = 'get-by-id';
  constructor(public readonly payload: Uuid) {}
}
