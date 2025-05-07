import { JobModule } from '@/modules/job/presentation/job.module';
import { AuthModule } from '@modules//auth/auth.module';
import { CvModule } from '@modules/cv/cv.module';
import { DepartmentModule } from '@modules/department/presentation/department.module';
import { FileModule } from '@modules/file/file.module';
import { HealthModule } from '@modules/health/health.module';
import { LlmModule } from '@modules/llm/llm.module';
import { OrganizationModule } from '@modules/organization/organization.module';
import { PermissionModule } from '@modules/permission/permission.module';
import { PositionModule } from '@modules/position/presentation/position.module';
import { RoleModule } from '@modules/role/role.module';
import { SessionModule } from '@modules/session/session.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import generateModulesSet from '@shared/modules-set';
import { SharedModule } from '@shared/shared.module';

const modulesGenerate = generateModulesSet();

@Module({
  imports: [
    ...modulesGenerate,
    EventEmitterModule.forRoot(),
    HealthModule,
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
  ],
})
export class AppModule {}
