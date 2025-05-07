import { JOB_STATUS } from '@common/constants/entity.enum';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@common/types/common.type';
import { Job } from '../../domain/entities/job';

export interface IJobRepository {
  findAll(filter: any): Promise<OffsetPaginatedDto<Job>>;
  findById(id: Uuid): Promise<Job | null>;
  findByOrganizationId(organizationId: Uuid): Promise<Job[]>;
  findByCreatorId(creatorId: Uuid): Promise<Job[]>;
  save(data: Job): Promise<Job>;
  update(id: Uuid, data: Partial<Job>): Promise<Job>;
  updateStatus(id: Uuid, status: JOB_STATUS): Promise<Job>;
  delete(id: Uuid): Promise<void>;
  count(filter: Partial<any>): Promise<number>;
  incrementApplicantCount(id: Uuid): Promise<void>;
}
