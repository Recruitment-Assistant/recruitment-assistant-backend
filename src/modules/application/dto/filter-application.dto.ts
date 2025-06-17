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
  id?: Uuid[];

  @StringFieldOptional({
    each: true,
    isArray: true,
    uniqueItems: true,
  })
  @IsUUID('4', { each: true })
  @Transform(({ value }) =>
    value && typeof value === 'string' ? [value] : value,
  )
  job_id?: Uuid[];

  @StringFieldOptional({
    each: true,
    isArray: true,
    uniqueItems: true,
  })
  @IsUUID('4', { each: true })
  @Transform(({ value }) =>
    value && typeof value === 'string' ? [value] : value,
  )
  stage_id?: Uuid[];

  ogranizationId?: Uuid;
}
