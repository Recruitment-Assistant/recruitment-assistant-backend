import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiAuth } from '@common/decorators/http.decorators';
import { ValidateUuid } from '@common/decorators/validators/uuid-validator';
import { ICurrentUser } from '@common/interfaces';
import { Uuid } from '@common/types/common.type';
import { CreateOrganizationUseCase } from '@modules/organization/use-cases/create-organization.use-case';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AddMemberDto } from './dto/request/add-member.dto';
import { CreateOrganizationDto } from './dto/request/create-organization.dto';
import { UpdateOrganizationDto } from './dto/request/update-organization.dto';
import { OrganizationMemberResDto } from './dto/response/organization-member.res.dto';
import { OrganizationResDto } from './dto/response/organization.res.dto';
import { OrganizationMapper } from './mappers/organization.mapper';
import { UserOrganizationMapper } from './mappers/user-organization.mapper';
import { AddOrganizationMemberUseCase } from './use-cases/add-organization-member.use-case';
import { GetMyOrganizationsUseCase } from './use-cases/get-my-organizations.use-case';
import { GetOrganizationByIdUseCase } from './use-cases/get-organization-by-id.use-case';
import { GetOrganizationMembersUseCase } from './use-cases/get-organization-members.use-case';
import { RemoveOrganizationMemberUseCase } from './use-cases/remove-organization-member.use-case';
import { UpdateOrganizationUseCase } from './use-cases/update-organization.use-case';

@Controller({ path: 'organizations', version: '1' })
@ApiTags('Organization APIs')
export class OrganizationController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly getMyOrganizationsUseCase: GetMyOrganizationsUseCase,
    private readonly getOrganizationByIdUseCase: GetOrganizationByIdUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
    private readonly addMemberUseCase: AddOrganizationMemberUseCase,
    private readonly removeMemberUseCase: RemoveOrganizationMemberUseCase,
    private readonly getOrganizationMembersUseCase: GetOrganizationMembersUseCase,
  ) {}

  @Post()
  @ApiAuth({
    summary: 'Create a new organization',
    statusCode: HttpStatus.CREATED,
    type: OrganizationResDto,
  })
  async create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.createOrganizationUseCase.execute(
      dto,
      currentUser,
    );
    return OrganizationMapper.toDto(result);
  }

  @Get()
  @ApiAuth({
    summary: 'Get my organizations',
    statusCode: HttpStatus.OK,
    type: OrganizationResDto,
    isArray: true,
  })
  async findMyOrganizations(@CurrentUser() user: ICurrentUser) {
    const result = await this.getMyOrganizationsUseCase.execute(user.id);
    return UserOrganizationMapper.toDtos(result);
  }

  @Get(':organizationId')
  @ApiAuth({
    summary: 'Get organization by id',
    statusCode: HttpStatus.OK,
    type: OrganizationResDto,
  })
  @ApiParam({
    name: 'organizationId',
    description: 'The UUID of the organization',
    type: 'string',
  })
  async getById(@Param('organizationId', ValidateUuid) organizationId: Uuid) {
    const result =
      await this.getOrganizationByIdUseCase.execute(organizationId);
    return OrganizationMapper.toDto(result);
  }

  @Put(':organizationId')
  @ApiAuth({
    summary: 'Update a organization',
    statusCode: HttpStatus.OK,
    type: OrganizationResDto,
  })
  @ApiParam({
    name: 'organizationId',
    description: 'The UUID of the organization',
    type: 'string',
  })
  async update(
    @Param('organizationId', ValidateUuid) organizationId: Uuid,
    @Body() dto: UpdateOrganizationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    const result = await this.updateOrganizationUseCase.execute(
      organizationId,
      dto,
      user,
    );
    return OrganizationMapper.toDto(result);
  }

  @Delete(':organizationId')
  @ApiAuth({
    summary: 'Delete a organization',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @ApiParam({
    name: 'organizationId',
    description: 'The UUID of the organization',
    type: 'string',
  })
  async delete(
    @Param('organizationId', ValidateUuid) organizationId: Uuid,
    @CurrentUser() user: ICurrentUser,
  ) {}

  @Get(':organizationId/members')
  @ApiAuth({
    summary: 'Get organization members',
    statusCode: HttpStatus.OK,
    type: OrganizationMemberResDto,
    isArray: true,
  })
  @ApiParam({
    name: 'organizationId',
    description: 'The UUID of the organization',
    type: 'string',
  })
  async getMembers(
    @Param('organizationId', ValidateUuid) organizationId: Uuid,
  ) {
    const result =
      await this.getOrganizationMembersUseCase.execute(organizationId);

    return plainToInstance(OrganizationMemberResDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post(':organizationId/members')
  @ApiAuth({
    summary: 'Add member to a organization',
    statusCode: HttpStatus.OK,
  })
  @ApiParam({
    name: 'organizationId',
    description: 'The UUID of the organization',
    type: 'string',
  })
  async addMember(
    @Param('organizationId', ValidateUuid) organizationId: Uuid,
    @Body() dto: AddMemberDto,
  ) {
    return this.addMemberUseCase.execute(organizationId, dto.userId);
  }

  @Delete(':organizationId/members/:userId')
  @ApiAuth({
    summary: 'Remove member from a organization',
    statusCode: HttpStatus.OK,
  })
  @ApiParam({
    name: 'organizationId',
    description: 'The UUID of the organization',
    type: 'string',
  })
  @ApiParam({
    name: 'userId',
    description: 'The UUID of the User',
    type: 'string',
  })
  async removeMember(
    @Param('organizationId', ValidateUuid) organizationId: Uuid,
    @Param('userId') userId: Uuid,
  ) {
    return this.removeMemberUseCase.execute(organizationId, userId);
  }
}
