import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto';
import { Uuid } from '@common/types/common.type';

export class FilterJobDto extends PageOptionsDto {
  organizationId: Uuid;
}
