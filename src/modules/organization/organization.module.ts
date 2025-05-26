import { AuthModule } from '@modules/auth/auth.module';
import { OrganizationEntity } from '@modules/organization/entities/organization.entity';
import { OrganizationRepository } from '@modules/organization/repositories/organization.repository';
import { CreateOrganizationUseCase } from '@modules/organization/use-cases/create-organization.use-case';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrganizationEntity } from './entities/user-organization.entity';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { UserOrganizationRepository } from './repositories/user-organization.repository';
import { AddOrganizationMemberUseCase } from './use-cases/add-organization-member.use-case';
import { GetMyOrganizationsUseCase } from './use-cases/get-my-organizations.use-case';
import { GetOrganizationByIdUseCase } from './use-cases/get-organization-by-id.use-case';
import { GetOrganizationMembersUseCase } from './use-cases/get-organization-members.use-case';
import { RemoveOrganizationMemberUseCase } from './use-cases/remove-organization-member.use-case';
import { UpdateOrganizationUseCase } from './use-cases/update-organization.use-case';

const providers = [
  OrganizationService,
  OrganizationRepository,
  UserOrganizationRepository,
  CreateOrganizationUseCase,
  GetMyOrganizationsUseCase,
  GetOrganizationByIdUseCase,
  UpdateOrganizationUseCase,
  AddOrganizationMemberUseCase,
  RemoveOrganizationMemberUseCase,
  GetOrganizationMembersUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationEntity, UserOrganizationEntity]),
    UserModule,
    AuthModule,
  ],
  controllers: [OrganizationController],
  providers,
  exports: [OrganizationService],
})
export class OrganizationModule {}
