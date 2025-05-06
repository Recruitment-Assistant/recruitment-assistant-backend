import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePositionUseCase } from '../application/use-cases/create-position.use-case';
import { DeletePositionUseCase } from '../application/use-cases/delete-position.use-case';
import { FilterPositionUseCase } from '../application/use-cases/filter-position.use-case';
import { FindPositionByIdUseCase } from '../application/use-cases/find-position-by-id.use-case';
import { UpdatePositionUseCase } from '../application/use-cases/update-position.use-case';
import { PositionEntity } from '../infrastructure/database/entities/position.entity';
import { PositionRepository } from '../infrastructure/database/repositories/position.repository';
import { POSITION_REPOSITORY } from '../position.constant';
import { PositionController } from './position.controller';

const providers: Provider[] = [
  CreatePositionUseCase,
  FindPositionByIdUseCase,
  FilterPositionUseCase,
  UpdatePositionUseCase,
  DeletePositionUseCase,
  {
    provide: POSITION_REPOSITORY,
    useClass: PositionRepository,
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity])],
  controllers: [PositionController],
  providers,
})
export class PositionModule {}
