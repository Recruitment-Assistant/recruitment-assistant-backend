import { CurrentOrganizationId } from '@common/decorators/current-organization.decorator';
import { ApiAuth } from '@common/decorators/http.decorators';
import { ValidateUuid } from '@common/decorators/validators/uuid-validator';
import { Uuid } from '@common/types/common.type';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PipelineResDto } from './dto/pipeline.res.dto';
import { PipelineService } from './pipeline.service';

@Controller({ path: 'pipelines', version: '1' })
@ApiTags('Pipeline APIs')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Get()
  @ApiAuth({
    summary: 'Get all pipelines',
    description: 'Get all pipelines',
    type: PipelineResDto,
    isArray: true,
  })
  async getAllPipeline(@CurrentOrganizationId() organizationId: Uuid) {
    return this.pipelineService.getAllPipelineByOrganizationId(organizationId);
  }

  @Get(':pipelineId')
  @ApiAuth({
    summary: 'Get pipeline by id',
    type: PipelineResDto,
  })
  @ApiParam({
    name: 'pipelineId',
    description: 'Pipeline id',
    type: 'string',
  })
  async getPipeline(@Param('pipelineId', ValidateUuid) pipelineId: Uuid) {
    return this.pipelineService.getPipelineById(pipelineId);
  }
}
