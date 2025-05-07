import { Mapper } from '@/core/domain/mapper';
import { plainToInstance } from 'class-transformer';
import { Department } from '../../domain/entities/department';
import { DepartmentEntity } from '../../infrastructure/database/entities/department.entity';
import { DepartmentResDto } from '../../presentation/dto/response/department.res.dto';

export class DepartmentMapper implements Mapper<Department> {
  static toDomain(entity: DepartmentEntity): Department {
    return new Department({
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      organizationId: entity.organizationId,
      organization: entity.organization,
      headId: entity.headId,
      head: entity.head ? entity.head : undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toPersistent(domain: Department): DepartmentEntity {
    const entity = new DepartmentEntity();
    entity.id = domain.id;
    entity.code = domain.code;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.organizationId = domain.organizationId;
    entity.headId = domain.headId;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;

    if (domain.organization) {
      entity.organization = domain.organization;
    }
    if (domain.head) {
      entity.head = domain.head;
    }

    return entity;
  }

  static toDto(department: Department): DepartmentResDto {
    return plainToInstance(DepartmentResDto, department, {
      excludeExtraneousValues: true,
      strategy: 'exposeAll',
    });
  }

  static toDtos(departments: Department[]): DepartmentResDto[] {
    return plainToInstance(DepartmentResDto, departments, {
      excludeExtraneousValues: true,
    });
  }
}
