import { JobModule } from '@/modules/job/presentation/job.module';
import { AuthModule } from '@modules//auth/auth.module';
import { ApplicationModule } from '@modules/application/application.module';
import { CandidateModule } from '@modules/candidate/candidate.module';
import { CvModule } from '@modules/cv/cv.module';
import { DepartmentModule } from '@modules/department/presentation/department.module';
import { FileModule } from '@modules/file/file.module';
import { HealthModule } from '@modules/health/health.module';
import { LlmModule } from '@modules/llm/llm.module';
import { OrganizationModule } from '@modules/organization/organization.module';
import { PermissionModule } from '@modules/permission/permission.module';
import { PipelineModule } from '@modules/pipeline/pipeline.module';
import { PositionModule } from '@modules/position/presentation/position.module';
import { RoleModule } from '@modules/role/role.module';
import { SessionModule } from '@modules/session/session.module';
import { StageModule } from '@modules/stage/stage.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import generateModulesSet from '@shared/modules-set';
import { SharedModule } from '@shared/shared.module';

const modulesGenerate = generateModulesSet();

@Module({
  imports: [
    ...modulesGenerate,
    EventEmitterModule.forRoot(),
    HealthModule,
    CqrsModule.forRoot(),
    AuthModule,
    UserModule,
    SessionModule,
    RoleModule,
    PermissionModule,
    SharedModule,
    FileModule,
    CvModule,
    LlmModule,
    OrganizationModule,
    PositionModule,
    JobModule,
    DepartmentModule,
    CandidateModule,
    ApplicationModule,
    PipelineModule,
    StageModule,
  ],
})
export class AppModule {}
