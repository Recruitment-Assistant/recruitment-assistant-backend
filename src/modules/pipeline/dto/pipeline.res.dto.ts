import {
  BooleanField,
  ClassFieldOptional,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@common/decorators/field.decorators';
import { BaseResDto } from '@common/dto/base.res.dto';
import { Uuid } from '@common/types/common.type';
import { StageResDto } from '@modules/stage/dto/stage.res.dto';
import { Expose } from 'class-transformer';

@Expose()
export class PipelineResDto extends BaseResDto {
  @UUIDField()
  @Expose()
  organization_id: Uuid;

  @StringField()
  @Expose()
  name: string;

  @StringFieldOptional()
  @Expose()
  description?: string;

  @BooleanField()
  @Expose()
  is_default: boolean;

  @ClassFieldOptional(() => StageResDto, { isArray: true, each: true })
  @Expose()
  stages?: StageResDto[];
}
