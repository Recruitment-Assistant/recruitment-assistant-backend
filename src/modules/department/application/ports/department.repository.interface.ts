import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@common/types/common.type';
import { FindOptionsWhere } from 'typeorm';
import { Department } from '../../domain/entities/department';
import { DepartmentEntity } from '../../infrastructure/database/entities/department.entity';

export interface IDepartmentRepository {
  save(data: Department): Promise<Department>;
  findAll(filter: any): Promise<OffsetPaginatedDto<Department>>;
  findById(id: Uuid): Promise<Department>;
  findOneByCondition(
    condition: FindOptionsWhere<DepartmentEntity>,
  ): Promise<Department>;
  update(id: Uuid, data: Partial<Department>): Promise<any>;
  delete(id: Uuid): Promise<any>;
}
