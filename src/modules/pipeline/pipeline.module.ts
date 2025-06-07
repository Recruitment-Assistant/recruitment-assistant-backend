import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineEntity } from './entities/pipeline.entity';
import { OrganizationCreatedHandler } from './handlers/organization.created.handler';
import { PipelineController } from './pipeline.controller';
import { PipelineService } from './pipeline.service';
import { PipelineRepository } from './repositories/pipeline.repository';

const providers: Provider[] = [
  PipelineService,
  PipelineRepository,

  // handlers
  OrganizationCreatedHandler,
];
@Module({
  imports: [TypeOrmModule.forFeature([PipelineEntity])],
  controllers: [PipelineController],
  providers,
})
export class PipelineModule {}
