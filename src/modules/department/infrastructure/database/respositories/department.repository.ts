import { Uuid } from '@/common/types/common.type';
import { DepartmentMapper } from '@/modules/department/application/mappers/department.mapper';
import { IDepartmentRepository } from '@/modules/department/application/ports/department.repository.interface';
import { Department } from '@/modules/department/domain/entities/department';
import { OffsetPaginationDto } from '@common/dto/offset-pagination/offset-pagination.dto';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { FilterDepartmentDto } from '@modules/department/presentation/dto/request/filter-department.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { DepartmentEntity } from '../entities/department.entity';

@Injectable()
export class DepartmentRepository implements IDepartmentRepository {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly repository: Repository<DepartmentEntity>,
  ) {}
  async save(data: Department): Promise<Department> {
    const department = DepartmentMapper.toPersistent(data);
    const departmentEntity = await this.repository.save(department);

    return DepartmentMapper.toDomain(departmentEntity);
  }

  async findById(id: Uuid): Promise<Department> {
    const department = await this.repository.findOneBy({ id });
    return department ? DepartmentMapper.toDomain(department) : null;
  }

  async findAll(
    filter: FilterDepartmentDto,
  ): Promise<OffsetPaginatedDto<Department>> {
    const searchCriteria = ['name', 'description'];
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

    const [departments, totalRecords] =
      await this.repository.findAndCount(findOptions);

    const meta = new OffsetPaginationDto(totalRecords, filter);
    return new OffsetPaginatedDto(
      departments.map(DepartmentMapper.toDomain),
      meta,
    );
  }

  update(id: Uuid, data: Partial<Department>) {
    return this.repository.update(id, data);
  }

  async findOneByCondition(
    condition: FindOptionsWhere<DepartmentEntity>,
  ): Promise<Department> {
    const department = await this.repository.findOneBy(condition);

    return department ? DepartmentMapper.toDomain(department) : null;
  }

  delete(id: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
