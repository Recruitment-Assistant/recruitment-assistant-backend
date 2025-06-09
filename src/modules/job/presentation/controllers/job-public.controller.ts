import { JOB_STATUS } from '@common/constants/entity.enum';
import { ApiPublic } from '@common/decorators/http.decorators';
import { Public } from '@common/decorators/public.decorator';
import { UploadFileDecorator } from '@common/decorators/upload-file.decorator';
import { ValidateUuid } from '@common/decorators/validators/uuid-validator';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@common/types/common.type';
import { ApplyJobCommand } from '@modules/application/commands/apply-job.command';
import { ApplyJobDto } from '@modules/application/dto/apply.job.dto';
import { MulterHandler } from '@modules/file/handlers/multer.handler';
import { JobMapper } from '@modules/job/application/mappers/job.mapper';
import { JobService } from '@modules/job/domain/services/job.service';
import { FilterJobDto } from '@modules/job/presentation/dto/request/filter-job.dto';
import { JobResDto } from '@modules/job/presentation/dto/response/job.res.dto';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@Controller({ path: '/public/jobs', version: '1' })
@ApiTags('Job Public APIs')
@Public()
export class JobPublicController {
  constructor(
    private readonly jobService: JobService,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiPublic({
    summary: 'Get all jobs',
    description: 'Get all jobs',
    type: JobResDto,
    isPaginated: true,
    paginationType: 'offset',
  })
  async getAllJobs(
    @Query() filter: FilterJobDto,
  ): Promise<OffsetPaginatedDto<JobResDto>> {
    filter.status = [JOB_STATUS.OPENING];
    const { data, meta } = await this.jobService.getAllJobs(filter);
    return new OffsetPaginatedDto(JobMapper.toDtos(data), meta);
  }

  @Get(':jobId')
  @ApiPublic({
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

  @Post(':jobId/apply')
  @ApiPublic({
    summary: 'Apply job',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @ApiParam({
    name: 'jobId',
    description: 'The UUID of the job',
    type: 'string',
  })
  @UploadFileDecorator()
  @UseInterceptors(
    FileInterceptor(
      'resume',
      new MulterHandler(
        ['.pdf'],
        './src/uploads',
        10 * 1024 * 1024,
      ).configurations(),
    ),
  )
  applyJob(
    @Param('jobId', ValidateUuid) jobId: Uuid,
    @Body() dto: ApplyJobDto,
    @Body('expected_salary') expected_salary: string,
    @UploadedFile() resume: Express.Multer.File,
  ) {
    dto.expected_salary = JSON.parse(expected_salary);
    this.commandBus.execute(new ApplyJobCommand(jobId, dto, resume));
  }
}
