import {
  BooleanField,
  NumberField,
  NumberFieldOptional,
  StringField,
  UUIDField,
} from '@common/decorators/field.decorators';
import { BaseResDto } from '@common/dto/base.res.dto';
import { Uuid } from '@common/types/common.type';
import { Expose } from 'class-transformer';

@Expose()
export class StageResDto extends BaseResDto {
  @UUIDField()
  @Expose()
  pipeline_id: Uuid;

  @StringField()
  @Expose()
  name: string;

  @NumberField()
  @Expose()
  stage_order: number;

  @NumberFieldOptional()
  @Expose()
  sla_days: number | null;

  @BooleanField()
  @Expose()
  is_terminal: boolean;
}
