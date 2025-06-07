import { Uuid } from '@common/types/common.type';
import { StageEntity } from '@modules/stage/entities/stage.entity';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DEFAULT_PIPELINE_NAME, DEFAULT_STAGES_CONFIG } from '../constants';
import { PipelineService } from '../pipeline.service';

@Injectable()
export class OrganizationCreatedHandler {
  constructor(private readonly pipelineService: PipelineService) {}

  @OnEvent('organization.created')
  async handle(organizationId: Uuid) {
    await this.pipelineService.create({
      name: DEFAULT_PIPELINE_NAME,
      organization_id: organizationId,
      stages: DEFAULT_STAGES_CONFIG as StageEntity[],
    });
  }
}
