import { JOB_STATUS } from '@common/constants/entity.enum';
import { EnumField } from '@common/decorators/field.decorators';

export class JobStatusDto {
  @EnumField(() => JOB_STATUS)
  status: JOB_STATUS;
}
