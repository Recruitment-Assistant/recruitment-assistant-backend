import { IDepartmentRepository } from '@/modules/department/application/ports/department.repository.interface';
import { JOB_STATUS } from '@common/constants/entity.enum';
import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import { DEPARTMENT_REPOSITORY } from '@modules/department/domain/constants';
import { IJobRepository } from '@modules/job/application/ports/job.repository.interface';
import { CreateJobDto } from '@modules/job/presentation/dto/request/create-job.dto';
import { IPositionRepository } from '@modules/position/application/ports/position.repository.interface';
import { POSITION_REPOSITORY } from '@modules/position/position.constant';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JOB_REPOSITORY } from '../constants';
import { Job } from '../entities/job';

@Injectable()
export class JobService {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepository: IPositionRepository,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async createJob(dto: CreateJobDto) {
    Optional.of(
      await this.positionRepository.findById(dto.positionId),
    ).throwIfNullable(new NotFoundException('Position not found'));

    Optional.of(
      await this.departmentRepository.findById(dto.departmentId),
    ).throwIfNullable(new NotFoundException('Department not found'));

    const job = new Job(dto);
    return this.jobRepository.save(job);
  }

  async getAllJobs(filter: any) {
    return this.jobRepository.findAll(filter);
  }

  @OnEvent('job.get-job-by-id')
  async getJobById(id: Uuid) {
    return Optional.of(await this.jobRepository.findById(id))
      .throwIfNullable(new NotFoundException('Job not found'))
      .get<Job>();
  }

  async updateJob(id: Uuid, data: Partial<Job>) {
    Optional.of(await this.jobRepository.findById(id)).throwIfNullable(
      new NotFoundException('Job not found'),
    );
    return this.jobRepository.update(id, data);
  }

  async updateJobStatus(id: Uuid, status: JOB_STATUS) {
    Optional.of(await this.jobRepository.findById(id)).throwIfNullable(
      new NotFoundException('Job not found'),
    );
    return this.jobRepository.updateStatus(id, status);
  }

  async deleteJob(id: Uuid) {
    Optional.of(await this.jobRepository.findById(id)).throwIfNullable(
      new NotFoundException('Job not found'),
    );

    return this.jobRepository.delete(id);
  }
}
