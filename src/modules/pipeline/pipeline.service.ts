import { Optional } from '@common/utils/optional';
import { ConflictException, Injectable } from '@nestjs/common';
import { PipelineEntity } from './entities/pipeline.entity';
import { PipelineRepository } from './repositories/pipeline.repository';

@Injectable()
export class PipelineService {
  constructor(private readonly pipelineRepository: PipelineRepository) {}

  async create(data: Partial<PipelineEntity>) {
    Optional.of(
      await this.pipelineRepository.countBy({
        name: data.name,
        organization_id: data.organization_id,
      }),
    ).throwIfPresent(new ConflictException('Pipeline name already exist'));

    return this.pipelineRepository.save(data);
  }
}
