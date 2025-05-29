import { ErrorCode } from '@common/constants/error-code';
import { ApiPublic } from '@common/decorators/http.decorators';
import { UploadFileDecorator } from '@common/decorators/upload-file.decorator';
import { ValidateUuid } from '@common/decorators/validators/uuid-validator';
import { ValidationException } from '@common/exceptions/validation.exception';
import { Uuid } from '@common/types/common.type';
import { ApplyJobDto } from '@modules/application/dto/apply.job.dto';
import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller({ path: 'jobs', version: '1' })
@ApiTags('Job Public APIs')
export class JobPublicController {
  constructor() {}

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
  ) {}
}
