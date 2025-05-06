import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Position } from '../../domain/entities/position';
import { POSITION_REPOSITORY } from '../../position.constant';
import { IPositionRepository } from '../ports/position.repository.interface';

@Injectable()
export class DeletePositionUseCase {
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly repository: IPositionRepository,
  ) {}

  async execute(id: Uuid) {
    const position = Optional.of(await this.repository.findById(id))
      .throwIfNullable(new NotFoundException('Position not found'))
      .get<Position>();

    await this.repository.delete(position.id);
  }
}
