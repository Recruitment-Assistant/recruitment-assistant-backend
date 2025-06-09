import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import { ConflictException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
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

  async getAllPipelineByOrganizationId(organizationId: Uuid) {
    return this.pipelineRepository.find({
      where: { organization_id: organizationId },
      relations: ['stages'],
      order: { stages: { stage_order: 'ASC' } },
    });
  }

  @OnEvent('pipeline.get-by-id')
  async getPipelineById(id: Uuid) {
    return this.pipelineRepository.findOne({
      where: { id },
      relations: ['stages'],
      order: { stages: { stage_order: 'ASC' } },
    });
  }
}
