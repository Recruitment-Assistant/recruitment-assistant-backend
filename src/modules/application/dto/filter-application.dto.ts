import { StringFieldOptional } from '@common/decorators/field.decorators';
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto';
import { Uuid } from '@common/types/common.type';
import { Expose, Transform } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Expose()
export class FilterApplicationDto extends PageOptionsDto {
  @StringFieldOptional({ each: true, isArray: true })
  @Expose()
  @IsUUID('4', { each: true })
  @Transform(({ value }) =>
    value && typeof value === 'string' ? [value] : value,
  )
  id?: string[];

  @StringFieldOptional({
    each: true,
    isArray: true,
    name: 'job_id',
    uniqueItems: true,
  })
  @Expose({ name: 'job_id' })
  @IsUUID('4', { each: true })
  @Transform(({ value }) =>
    value && typeof value === 'string' ? [value] : value,
  )
  jobId?: Uuid[];

  ogranizationId?: Uuid;
}
