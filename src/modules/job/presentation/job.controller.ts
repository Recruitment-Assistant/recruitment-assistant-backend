import { ErrorCode } from '@common/constants/error-code';
import { CurrentOrganizationId } from '@common/decorators/current-organization.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiAuth } from '@common/decorators/http.decorators';
import { UploadFileDecorator } from '@common/decorators/upload-file.decorator';
import { ValidateUuid } from '@common/decorators/validators/uuid-validator';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { ValidationException } from '@common/exceptions/validation.exception';
import { ICurrentUser } from '@common/interfaces';
import { Uuid } from '@common/types/common.type';
import { UploadResumeByJobIdUseCase } from '@modules/application/use-cases/upload-resume-by-job-id.use-case';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
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
  constructor(
    private readonly jobService: JobService,
    private readonly uploadResumeByJobIdUseCase: UploadResumeByJobIdUseCase,
  ) {}

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

  @Get(':jobId')
  @ApiAuth({
    summary: 'Get job by id',
    description: 'Get job by id',
    type: JobResDto,
  })
  @ApiParam({
    name: 'jobId',
    description: 'The UUID of the job',
    type: 'string',
  })
  async getJobById(
    @Param('jobId', ValidateUuid) jobId: Uuid,
  ): Promise<JobResDto> {
    const result = await this.jobService.getJobById(jobId);
    return JobMapper.toDto(result);
  }

  @Put(':jobId')
  @ApiAuth({
    summary: 'Update job',
    description: 'Update job',
    type: JobResDto,
  })
  @ApiParam({
    name: 'jobId',
    description: 'The UUID of the job',
    type: 'string',
  })
  async updateJob(
    @Param('jobId', ValidateUuid) jobId: Uuid,
    @Body() dto: UpdateJobDto,
  ) {
    const result = await this.jobService.updateJob(jobId, dto);
    return JobMapper.toDto(result);
  }

  @Put(':jobId/status')
  @ApiAuth({
    summary: 'Update job status',
    description: 'Update job status',
    type: JobResDto,
  })
  @ApiParam({
    name: 'jobId',
    description: 'The UUID of the job',
    type: 'string',
  })
  async updateJobStatus(
    @Param('jobId', ValidateUuid) jobId: Uuid,
    @Body() dto: JobStatusDto,
  ) {
    const result = await this.jobService.updateJobStatus(jobId, dto.status);
    return JobMapper.toDto(result);
  }

  @Delete(':jobId')
  @ApiAuth({
    summary: 'Delete job',
    description: 'Delete job',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @ApiParam({
    name: 'jobId',
    description: 'The UUID of the job',
    type: 'string',
  })
  async deleteJob(@Param('jobId', ValidateUuid) jobId: Uuid) {
    await this.jobService.deleteJob(jobId);
  }

  @Post(':jobId/resumes/upload')
  @ApiAuth({
    summary: 'Upload resumes',
    description: 'Upload list resume',
  })
  @ApiParam({
    name: 'jobId',
    description: 'The UUID of the job',
    type: 'string',
  })
  @UploadFileDecorator()
  @UseInterceptors(
    FilesInterceptor('resumes', 10, {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (_req, file, cb) => {
          const fileName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          !['.pdf'].includes(
            path.extname(file.originalname).toLocaleLowerCase(),
          )
        ) {
          cb(
            new ValidationException(ErrorCode.COMMON, 'Only support pdf file'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async uploadResumes(
    @Param('jobId', ValidateUuid) jobId: Uuid,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.uploadResumeByJobIdUseCase.execute(jobId, files);
  }
}
