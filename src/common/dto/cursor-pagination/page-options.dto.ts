import { DEFAULT_PAGE_LIMIT } from '@common/constants/app.constant';
import {
  NumberFieldOptional,
  StringFieldOptional,
} from '@common/decorators/field.decorators';

export class PageOptionsDto {
  @StringFieldOptional()
  afterCursor?: string;

  @StringFieldOptional()
  beforeCursor?: string;

  @NumberFieldOptional({
    minimum: 1,
    default: DEFAULT_PAGE_LIMIT,
    int: true,
  })
  readonly limit?: number = DEFAULT_PAGE_LIMIT;

  @StringFieldOptional()
  readonly q?: string;
}
