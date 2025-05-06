import { Mapper } from '@core/domain/mapper';
import { plainToInstance } from 'class-transformer';
import { Position } from '../../domain/entities/position';
import { PositionEntity } from '../../infrastructure/database/entities/position.entity';
import { PositionResDto } from '../../presentation/dto/response/position.res.dto';

export class PositionMapper implements Mapper<Position> {
  static toDomain(entity: PositionEntity): Position {
    return new Position({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      organizationId: entity.organizationId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toPersistent(domain: Position): PositionEntity {
    return new PositionEntity({
      id: domain.id,
      title: domain.title,
      description: domain.description,
      organizationId: domain.organizationId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      deletedAt: domain.deletedAt,
    });
  }

  static toDto(position: Position): PositionResDto {
    return plainToInstance(PositionResDto, position, {
      excludeExtraneousValues: true,
    });
  }

  static toDtos(positions: Position[]): PositionResDto[] {
    return plainToInstance(PositionResDto, positions, {
      excludeExtraneousValues: true,
    });
  }
}
