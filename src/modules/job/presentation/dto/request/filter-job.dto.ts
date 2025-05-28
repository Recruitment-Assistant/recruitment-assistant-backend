import { JOB_STATUS } from '@common/constants/entity.enum';
import { EnumFieldOptional } from '@common/decorators/field.decorators';
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto';
import { Uuid } from '@common/types/common.type';
import { Transform } from 'class-transformer';

export class FilterJobDto extends PageOptionsDto {
  organizationId: Uuid;

  @EnumFieldOptional(() => JOB_STATUS, { isArray: true, each: true })
  @Transform(({ value }) =>
    value && typeof value === 'string' ? [value] : value,
  )
  status: JOB_STATUS[];
}
