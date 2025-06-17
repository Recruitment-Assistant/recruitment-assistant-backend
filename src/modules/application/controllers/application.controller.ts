import { CurrentOrganizationId } from '@common/decorators/current-organization.decorator';
import { ApiAuth } from '@common/decorators/http.decorators';
import { ValidateUuid } from '@common/decorators/validators/uuid-validator';
import { Uuid } from '@common/types/common.type';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ApplicationService } from '../application.service';
import { FilterApplicationDto } from '../dto/filter-application.dto';

@Controller({ path: 'applications', version: '1' })
@ApiTags('Application APIs')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  @ApiAuth({
    description: 'Get all applications',
    summary: 'Get all applications',
  })
  async getAllApplications(
    @Query() filter: FilterApplicationDto,
    @CurrentOrganizationId() organizationId: Uuid,
  ) {
    filter.ogranizationId = organizationId;
    return this.applicationService.getListApplication(filter);
  }

  @Get(':applicationId')
  @ApiAuth({
    description: 'Get application by id',
    summary: 'Get application by id',
  })
  @ApiParam({
    name: 'applicationId',
    type: 'string',
    description: 'The UUID of the application',
  })
  async getApplicationById(
    @Param('applicationId', ValidateUuid) applicationId: Uuid,
  ) {
    return this.applicationService.getApplicationById(applicationId);
  }
}
