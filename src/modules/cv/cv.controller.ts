import { ApiPublic } from '@/common/decorators/http.decorators';
import { UploadFileDecorator } from '@/common/decorators/upload-file.decorator';
import { extractTextFromPDF } from '@/common/utils/pdf.util';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CvService } from './cv.service';
import { generatePrompt } from './utils/generate-prompt.util';

@Controller({ path: 'cv', version: '1' })
export class CvController {
  constructor(private readonly cvService: CvService) {}

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
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const cvText = await extractTextFromPDF(file.path);
    const prompt = generatePrompt(cvText);
    return {
      fileName: file.originalname,
      textPreview: cvText,
      prompt,
    };
  }
}
