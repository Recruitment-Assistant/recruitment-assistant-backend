import { Mapper } from '@/core/domain/mapper';
import { DepartmentMapper } from '@modules/department/application/mappers/department.mapper';
import { plainToInstance } from 'class-transformer';
import { Job } from '../../domain/entities/job';
import { JobEntity } from '../../infrastructure/database/entities/job.entity';
import { JobResDto } from './../../presentation/dto/response/job.res.dto';

export class JobMapper implements Mapper<Job> {
  static toDomain(entity: JobEntity): Job {
    const job = new Job({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      requirements: entity.requirements,
      tags: entity.tags,
      location: entity.location,
      publishedAt: entity.publishedAt,
      closedAt: entity.closedAt,
      status: entity.status,
      quantity: entity.quantity,
      remoteEligible: entity.remoteEligible,
      employmentType: entity.employmentType,
      salaryRange: entity.salaryRange,
      organizationId: entity.organizationId,
      departmentId: entity.departmentId,
      pipeline_id: entity.pipeline_id,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });

    if (entity.organization) {
      job.organization = entity.organization;
    }

    if (entity.creator) {
      job.creator = entity.creator;
    }

    if (entity.department) {
      job.department = DepartmentMapper.toDomain(entity.department);
    }

    if (entity.pipeline) {
      job.pipeline = entity.pipeline;
    }

    if (entity.applications && entity.applications.length > 0) {
      job.applied_count = entity.applications.length;
    }

    return job;
  }

  static toPersistent(domain: Job): JobEntity {
    const entity = new JobEntity({
      id: domain.id,
      title: domain.title,
      description: domain.description,
      requirements: domain.requirements,
      tags: domain.tags,
      location: domain.location,
      publishedAt: domain.publishedAt,
      closedAt: domain.closedAt,
      status: domain.status,
      quantity: domain.quantity,
      remoteEligible: domain.remoteEligible,
      employmentType: domain.employmentType,
      salaryRange: domain.salaryRange,
      organizationId: domain.organizationId,
      departmentId: domain.departmentId,
      pipeline_id: domain.pipeline_id,
      createdBy: domain.createdBy,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      deletedAt: domain.deletedAt,
    });

    if (domain.organization) {
      entity.organization = domain.organization;
    }

    if (domain.department) {
      entity.department = DepartmentMapper.toPersistent(domain.department);
    }

    if (domain.creator) {
      entity.creator = domain.creator;
    }

    return entity;
  }

  static toDto(job: Job): JobResDto {
    return plainToInstance(JobResDto, job, {
      excludeExtraneousValues: true,
    });
  }

  static toDtos(jobs: Job[]): JobResDto[] {
    return plainToInstance(JobResDto, jobs, {
      excludeExtraneousValues: true,
    });
  }

  static toPreviewDto(job: Job): any {
    return plainToInstance(Object, job, {
      excludeExtraneousValues: true,
    });
  }

  static toPreviewDtos(jobs: Job[]): any[] {
    return plainToInstance(Object, jobs, {
      excludeExtraneousValues: true,
    });
  }
}
