import { CreateOrganizationDto } from '@modules/organization/dto/request/create-organization.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
