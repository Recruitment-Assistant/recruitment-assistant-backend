import { OffsetPaginationDto } from '@/common/dto/offset-pagination/offset-pagination.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { FilterPositionDto } from '@/modules/position/presentation/dto/request/filter-position.dto';
import { Uuid } from '@common/types/common.type';
import { PositionMapper } from '@modules/position/application/mappers/position.mapper';
import { IPositionRepository } from '@modules/position/application/ports/position.repository.interface';
import { Position } from '@modules/position/domain/entities/position';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PositionEntity } from '../entities/position.entity';

@Injectable()
export class PositionRepository implements IPositionRepository {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly repository: Repository<PositionEntity>,
  ) {}

  async findPositionsByOrganizationId(
    organizationId: Uuid,
  ): Promise<Position[]> {
    const positions = await this.repository.find({
      where: { organizationId },
    });

    return positions.map(PositionMapper.toDomain);
  }

  async findAll(
    filter: FilterPositionDto,
  ): Promise<OffsetPaginatedDto<Position>> {
    const searchCriteria = ['title', 'description'];
    const whereCondition = [];
    const findOptions: FindManyOptions = {};

    if (filter.keywords) {
      for (const key of searchCriteria) {
        whereCondition.push({
          [key]: ILike(`%${filter.keywords}%`),
        });
      }
    }
    findOptions.take = filter.limit;
    findOptions.skip = filter.page ? (filter.page - 1) * filter.limit : 0;
    findOptions.where = whereCondition;
    findOptions.order = { createdAt: filter.order };

    const [positions, totalRecords] =
      await this.repository.findAndCount(findOptions);

    const meta = new OffsetPaginationDto(totalRecords, filter);
    return new OffsetPaginatedDto(positions.map(PositionMapper.toDomain), meta);
  }

  async findById(id: Uuid): Promise<Position | null> {
    const position = await this.repository.findOneBy({ id });
    return position ? PositionMapper.toDomain(position) : null;
  }

  async findOneByCondition(
    condition: FindOptionsWhere<PositionEntity>,
  ): Promise<Position | null> {
    if (condition.title) {
      condition.title = ILike(`%${condition.title}%`);
    }

    const position = await this.repository.findOneBy(condition);
    return position ? PositionMapper.toDomain(position) : null;
  }

  async save(data: Position): Promise<Position> {
    const entity = PositionMapper.toPersistent(data);
    await this.repository.save(entity);
    return PositionMapper.toDomain(entity);
  }

  update(id: Uuid, data: Partial<Position>): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: Uuid): Promise<void> {
    await this.repository.softDelete(id);
  }
}
