import { Module } from '@nestjs/common';
import { LlmModule } from '../llm/llm.module';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';

@Module({
  imports: [LlmModule],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
