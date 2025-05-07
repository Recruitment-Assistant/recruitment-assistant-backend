import { CurrentOrganizationId } from '@common/decorators/current-organization.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiAuth } from '@common/decorators/http.decorators';
import { ValidateUuid } from '@common/decorators/validators/uuid-validator';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { ICurrentUser } from '@common/interfaces';
import { Uuid } from '@common/types/common.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { JobMapper } from '../application/mappers/job.mapper';
import { JobService } from '../domain/services/job.service';
import { CreateJobDto } from './dto/request/create-job.dto';
import { FilterJobDto } from './dto/request/filter-job.dto';
import { JobStatusDto } from './dto/request/job-status.dto';
import { UpdateJobDto } from './dto/request/update-job.dto';
import { JobResDto } from './dto/response/job.res.dto';

@Controller({ path: 'jobs', version: '1' })
@ApiTags('Job APIs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @ApiAuth({
    summary: 'Create a job',
    description: 'Create a job',
    type: JobResDto,
  })
  async createJob(
    @CurrentUser() user: ICurrentUser,
    @Body() dto: CreateJobDto,
  ): Promise<JobResDto> {
    dto.organizationId = user.currentOrganizationId;
    dto.createdBy = user.id;
    const result = await this.jobService.createJob(dto);
    return JobMapper.toDto(result);
  }

  @Get()
  @ApiAuth({
    summary: 'Get all jobs',
    description: 'Get all jobs',
    type: JobResDto,
    isPaginated: true,
    paginationType: 'offset',
  })
  async getAllJobs(
    @Query() filter: FilterJobDto,
    @CurrentOrganizationId() organizationId: Uuid,
  ): Promise<OffsetPaginatedDto<JobResDto>> {
    filter.organizationId = organizationId;
    const { data, meta } = await this.jobService.getAllJobs(filter);
    return new OffsetPaginatedDto(JobMapper.toDtos(data), meta);
  }

  @Get(':id')
  @ApiAuth({
    summary: 'Get job by id',
    description: 'Get job by id',
    type: JobResDto,
  })
  @ApiParam({ name: 'id', description: 'The UUID of the job', type: 'string' })
  async getJobById(@Param('id', ValidateUuid) id: Uuid): Promise<JobResDto> {
    const result = await this.jobService.getJobById(id);
    return JobMapper.toDto(result);
  }

  @Put(':id')
  @ApiAuth({
    summary: 'Update job',
    description: 'Update job',
    type: JobResDto,
  })
  @ApiParam({ name: 'id', description: 'The UUID of the job', type: 'string' })
  async updateJob(
    @Param('id', ValidateUuid) id: Uuid,
    @Body() dto: UpdateJobDto,
  ) {
    const result = await this.jobService.updateJob(id, dto);
    return JobMapper.toDto(result);
  }

  @Put(':id/status')
  @ApiAuth({
    summary: 'Update job status',
    description: 'Update job status',
    type: JobResDto,
  })
  @ApiParam({ name: 'id', description: 'The UUID of the job', type: 'string' })
  async updateJobStatus(
    @Param('id', ValidateUuid) id: Uuid,
    @Body() dto: JobStatusDto,
  ) {
    const result = await this.jobService.updateJobStatus(id, dto.status);
    return JobMapper.toDto(result);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete job',
    description: 'Delete job',
    type: JobResDto,
  })
  @ApiParam({ name: 'id', description: 'The UUID of the job', type: 'string' })
  async deleteJob(@Param('id', ValidateUuid) id: Uuid) {
    await this.jobService.deleteJob(id);
  }
}
