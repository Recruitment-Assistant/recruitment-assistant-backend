import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Position } from '../../domain/entities/position';
import { POSITION_REPOSITORY } from '../../position.constant';
import { FilterPositionDto } from '../../presentation/dto/request/filter-position.dto';
import { IPositionRepository } from '../ports/position.repository.interface';

@Injectable()
export class FilterPositionUseCase {
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly repository: IPositionRepository,
  ) {}

  execute(
    filteerOptions: FilterPositionDto,
  ): Promise<OffsetPaginatedDto<Position>> {
    return this.repository.findAll(filteerOptions);
  }
}
