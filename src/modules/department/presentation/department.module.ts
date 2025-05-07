import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DEPARTMENT_REPOSITORY } from '../domain/constants';
import { DepartmentService } from '../domain/services/department.service';
import { DepartmentEntity } from '../infrastructure/database/entities/department.entity';
import { DepartmentRepository } from '../infrastructure/database/respositories/department.repository';
import { DepartmentController } from './department.controller';

const providers: Provider[] = [
  DepartmentService,
  {
    provide: DEPARTMENT_REPOSITORY,
    useClass: DepartmentRepository,
  },
];
@Module({
  imports: [TypeOrmModule.forFeature([DepartmentEntity])],
  controllers: [DepartmentController],
  providers,
  exports: [DEPARTMENT_REPOSITORY],
})
export class DepartmentModule {}
