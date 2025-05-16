import { ApplicationModule } from '@modules/application/application.module';
import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';

@Module({
  imports: [ApplicationModule],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
