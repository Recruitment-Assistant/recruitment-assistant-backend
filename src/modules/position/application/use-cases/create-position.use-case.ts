import { Optional } from '@common/utils/optional';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Position } from '../../domain/entities/position';
import { POSITION_REPOSITORY } from '../../position.constant';
import { CreatePositionDto } from '../../presentation/dto/request/create-position.dto';
import { IPositionRepository } from '../ports/position.repository.interface';

@Injectable()
export class CreatePositionUseCase {
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly repository: IPositionRepository,
  ) {}

  async execute(data: CreatePositionDto): Promise<Position> {
    Optional.of(
      await this.repository.findOneByCondition({
        title: data.title,
        organizationId: data.organizationId,
      }),
    ).throwIfPresent(new ConflictException('Position already exists'));

    const position = new Position(data);
    return this.repository.save(position);
  }
}
