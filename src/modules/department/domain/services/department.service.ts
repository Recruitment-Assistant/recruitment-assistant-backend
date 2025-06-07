import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import { FilterDepartmentDto } from '@modules/department/presentation/dto/request/filter-department.dto';
import { UpdateDepartmentDto } from '@modules/department/presentation/dto/request/update-department.dto';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Not } from 'typeorm';
import { IDepartmentRepository } from '../../application/ports/department.repository.interface';
import { CreateDepartmentDto } from '../../presentation/dto/request/create-department.dto';
import { DEPARTMENT_REPOSITORY } from '../constants';
import { Department } from '../entities/department';

@Injectable()
export class DepartmentService {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly repository: IDepartmentRepository,
  ) {}

  async create(data: CreateDepartmentDto): Promise<Department> {
    Optional.of(
      await this.repository.findOneByCondition({
        code: data.code,
        organizationId: data.organizationId,
      }),
    ).throwIfPresent(new ConflictException('Department already exists'));

    const department = new Department(data);
    return this.repository.save(department);
  }

  async update(id: Uuid, dto: UpdateDepartmentDto) {
    const department = Optional.of(await this.repository.findById(id))
      .throwIfNullable(new NotFoundException('Department not found'))
      .get<Department>();

    Optional.of(
      await this.repository.findOneByCondition({
        code: dto.code || department.code,
        organizationId: dto.organizationId || department.organizationId,
        id: Not(id),
      }),
    ).throwIfPresent(new ConflictException('Department already exists'));

    department.updateDetails(dto);
    await this.repository.update(id, dto);

    return department;
  }

  async findById(id: Uuid) {
    return Optional.of(await this.repository.findById(id))
      .throwIfNullable(new NotFoundException('Department not found'))
      .get<Department>();
  }

  async findAll(filter: FilterDepartmentDto) {
    return this.repository.findAll(filter);
  }

  async delete(id: Uuid) {
    Optional.of(await this.repository.findById(id)).throwIfNullable(
      new NotFoundException('Department not found'),
    );

    await this.repository.delete(id);
  }
}
