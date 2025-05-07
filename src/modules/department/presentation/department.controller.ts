import { CurrentOrganizationId } from '@common/decorators/current-organization.decorator';
import { ApiAuth } from '@common/decorators/http.decorators';
import { ValidateUuid } from '@common/decorators/validators/uuid-validator';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@common/types/common.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { DepartmentMapper } from '../application/mappers/department.mapper';
import { DepartmentService } from '../domain/services/department.service';
import { CreateDepartmentDto } from './dto/request/create-department.dto';
import { FilterDepartmentDto } from './dto/request/filter-department.dto';
import { UpdateDepartmentDto } from './dto/request/update-department.dto';
import { DepartmentResDto } from './dto/response/department.res.dto';

@Controller({ path: 'departments', version: '1' })
@ApiTags('Department APIs')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiAuth({
    summary: 'Create department',
    type: DepartmentResDto,
  })
  async create(
    @Body() dto: CreateDepartmentDto,
    @CurrentOrganizationId() organizationId: Uuid,
  ) {
    dto.organizationId = organizationId;
    const result = await this.departmentService.create(dto);
    return DepartmentMapper.toDto(result);
  }

  @Get(':departmentId')
  @ApiAuth({
    summary: 'Find a department',
    type: DepartmentResDto,
  })
  @ApiParam({
    name: 'departmentId',
    description: 'The UUID of the department',
    type: 'string',
  })
  async findById(@Param('departmentId', ValidateUuid) departmentId: Uuid) {
    const result = await this.departmentService.findById(departmentId);
    return DepartmentMapper.toDto(result);
  }

  @Get()
  @ApiAuth({
    summary: 'Find all department',
    type: DepartmentResDto,
    isPaginated: true,
    paginationType: 'offset',
  })
  async findAll(@Query() filter: FilterDepartmentDto) {
    const { data, meta } = await this.departmentService.findAll(filter);
    return new OffsetPaginatedDto(DepartmentMapper.toDtos(data), meta);
  }

  @Put(':departmentId')
  @ApiAuth({
    summary: 'Update department',
    type: DepartmentResDto,
  })
  @ApiParam({
    name: 'departmentId',
    description: 'The UUID of the department',
    type: 'string',
  })
  async update(
    @Param('departmentId', ValidateUuid) departmentId: Uuid,
    @Body() dto: UpdateDepartmentDto,
  ) {
    const result = await this.departmentService.update(departmentId, dto);
    return DepartmentMapper.toDto(result);
  }

  @Delete(':departmentId')
  @ApiAuth({
    summary: 'Delete department',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @ApiParam({
    name: 'departmentId',
    description: 'The UUID of the department',
    type: 'string',
  })
  async delete(@Param('departmentId', ValidateUuid) departmentId: Uuid) {
    await this.departmentService.delete(departmentId);
  }
}
