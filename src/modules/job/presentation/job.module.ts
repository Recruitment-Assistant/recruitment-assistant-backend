import { ApplicationModule } from '@modules/application/application.module';
import { DepartmentModule } from '@modules/department/presentation/department.module';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JOB_REPOSITORY } from '../domain/constants';
import { JobService } from '../domain/services/job.service';
import { JobEntity } from '../infrastructure/database/entities/job.entity';
import { JobRepository } from '../infrastructure/database/repositoties/job.repository';
import { JobController } from './controllers/job.controller';

const providers: Provider[] = [
  JobService,
  {
    provide: JOB_REPOSITORY,
    useClass: JobRepository,
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity]),
    DepartmentModule,
    ApplicationModule,
  ],
  controllers: [JobController],
  providers,
  exports: [JobService],
})
export class JobModule {}
