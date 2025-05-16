import { ApiPublic } from '@/common/decorators/http.decorators';
import { UploadFileDecorator } from '@/common/decorators/upload-file.decorator';
import { ErrorCode } from '@common/constants/error-code';
import { ValidationException } from '@common/exceptions/validation.exception';
import {
  RESUME_ANALYZER_PORT,
  RESUME_PARSER_PORT,
} from '@modules/application/constants';
import { JD_TEXT } from '@modules/application/constants/prompt-analysis-resume.constant';
import { ResumeAnalyzerPort } from '@modules/application/ports/resume-analyzer.port';
import { ResumeParserPort } from '@modules/application/ports/resume-parser.port';
import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import PdfParse from 'pdf-parse';
import { CvService } from './cv.service';

@Controller({ path: 'cv', version: '1' })
@ApiTags('CV APIs')
export class CvController {
  constructor(
    private readonly cvService: CvService,
    @Inject(RESUME_PARSER_PORT)
    private readonly parser: ResumeParserPort,
    @Inject(RESUME_ANALYZER_PORT)
    private readonly analyzer: ResumeAnalyzerPort,
  ) {}

  @ApiPublic({
    summary: 'Upload file',
  })
  @Post('upload')
  @UploadFileDecorator()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await PdfParse(dataBuffer);
    const resumeText = pdfData.text;
    const result1 = await this.parser.parse(dataBuffer);
    const result2 = await this.analyzer.analyze(JD_TEXT, resumeText);
    return { result1, result2 };
  }
}
