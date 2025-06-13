import { JOB_STATUS } from '@common/constants/entity.enum';
import { OffsetPaginationDto } from '@common/dto/offset-pagination/offset-pagination.dto';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@common/types/common.type';
import { JobMapper } from '@modules/job/application/mappers/job.mapper';
import { IJobRepository } from '@modules/job/application/ports/job.repository.interface';
import { Job } from '@modules/job/domain/entities/job';
import { FilterJobDto } from '@modules/job/presentation/dto/request/filter-job.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindOptionsWhere, Repository } from 'typeorm';
import { JobEntity } from '../entities/job.entity';

@Injectable()
export class JobRepository implements IJobRepository {
  constructor(
    @InjectRepository(JobEntity)
    private readonly repository: Repository<JobEntity>,
  ) {}

  async save(data: Job): Promise<Job> {
    const entity = JobMapper.toPersistent(data);
    const savedEntity = await this.repository.save(entity);
    return JobMapper.toDomain(savedEntity);
  }

  async findById(id: Uuid): Promise<Job | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['organization', 'department', 'creator'],
    });
    return entity ? JobMapper.toDomain(entity) : null;
  }

  async findByCreatorId(creatorId: Uuid): Promise<Job[]> {
    const entities = await this.repository.find({
      where: { createdBy: creatorId },
    });
    return entities.map(JobMapper.toDomain);
  }

  async findAll(filter: FilterJobDto): Promise<OffsetPaginatedDto<Job>> {
    const searchCriteria = [
      'job.title',
      'job.location',
      'job.employmentType',
      'organization.name',
    ];

    const queryBuilder = this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .leftJoinAndSelect('job.department', 'department')
      .leftJoinAndSelect('job.creator', 'creator');

    if (filter.status) {
      queryBuilder.andWhere('job.status IN (:...status)', {
        status: filter.status,
      });
    }

    if (filter.organizationId) {
      queryBuilder.andWhere('job.organization_id = :organizationId', {
        organizationId: filter.organizationId,
      });
    }

    if (filter.keywords) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const field of searchCriteria) {
            qb.orWhere(`${field} ILIKE :keywords`, {
              keywords: `%${filter.keywords}%`,
            });
          }
        }),
      );
    }

    queryBuilder.take(filter.limit).skip(filter.offset);

    const [entities, total] = await queryBuilder.getManyAndCount();
    const meta = new OffsetPaginationDto(total, filter);
    return new OffsetPaginatedDto(entities.map(JobMapper.toDomain), meta);
  }

  async update(id: Uuid, data: Partial<Job>): Promise<Job> {
    await this.repository.update(id, JobMapper.toPersistent(data as Job));
    return this.findById(id);
  }

  async updateStatus(id: Uuid, status: JOB_STATUS): Promise<Job> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async count(filter: FindOptionsWhere<JobEntity>): Promise<number> {
    return this.repository.count({
      where: filter as FindOptionsWhere<JobEntity>,
    });
  }

  async delete(id: Uuid): Promise<void> {
    await this.repository.softDelete(id);
  }

  async findByOrganizationId(organizationId: Uuid): Promise<Job[]> {
    const entities = await this.repository.find({
      where: { organizationId },
      relations: ['department', 'position'],
    });
    return entities.map(JobMapper.toDomain);
  }

  async incrementApplicantCount(id: Uuid): Promise<void> {
    await this.repository.increment({ id }, 'applicantsCount', 1);
  }
}
