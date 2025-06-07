import { ApiAuth } from '@common/decorators/http.decorators';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async getAllPipeline() {}

  @Get(':pipelineId')
  @ApiAuth({
    summary: 'Get pipeline by id',
    type: PipelineResDto,
  })
  async getPipeline() {}
}
