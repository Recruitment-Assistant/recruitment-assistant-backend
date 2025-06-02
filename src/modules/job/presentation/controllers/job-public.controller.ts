import { JOB_STATUS } from '@common/constants/entity.enum';
import { ErrorCode } from '@common/constants/error-code';
import { ApiPublic } from '@common/decorators/http.decorators';
import { Public } from '@common/decorators/public.decorator';
import { UploadFileDecorator } from '@common/decorators/upload-file.decorator';
import { ValidateUuid } from '@common/decorators/validators/uuid-validator';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { ValidationException } from '@common/exceptions/validation.exception';
import { Uuid } from '@common/types/common.type';
import { ApplyJobDto } from '@modules/application/dto/apply.job.dto';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller({ path: '/public/jobs', version: '1' })
@ApiTags('Job Public APIs')
@Public()
export class JobPublicController {
  constructor(private readonly jobService: JobService) {}

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
    statusCode: HttpStatus.CREATED,
  })
  @ApiParam({
    name: 'jobId',
    description: 'The UUID of the job',
    type: 'string',
  })
  @UploadFileDecorator()
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (_req, file, cb) => {
          console.log('check file: ', file);
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
  applyJob(
    @Param('jobId', ValidateUuid) jobId: Uuid,
    @Body() dto: ApplyJobDto,
    @UploadedFile() resume: Express.Multer.File,
  ) {
    console.log('check file: ', resume);
    return {
      jobId,
      resume,
    };
  }
}
