import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@common/types/common.type';
import { Position } from '../../domain/entities/position';
import { FilterPositionDto } from '../../presentation/dto/request/filter-position.dto';

export interface IPositionRepository {
  findPositionsByOrganizationId(organizationId: string): Promise<Position[]>;
  findAll(filter: FilterPositionDto): Promise<OffsetPaginatedDto<Position>>;
  findOneByCondition(condition: Partial<Position>): Promise<Position | null>;
  save(data: Position): Promise<Position>;
  findById(id: Uuid): Promise<Position | null>;
  update(id: Uuid, data: Partial<Position>): Promise<any>;
  delete(id: Uuid): Promise<void>;
}
