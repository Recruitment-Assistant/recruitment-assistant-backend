import { CurrentOrganizationId } from '@/common/decorators/current-organization.decorator';
import { ApiAuth } from '@/common/decorators/http.decorators';
import { ValidateUuid } from '@/common/decorators/validators/uuid-validator';
import { Uuid } from '@/common/types/common.type';
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
import { PositionMapper } from '../application/mappers/position.mapper';
import { CreatePositionUseCase } from '../application/use-cases/create-position.use-case';
import { DeletePositionUseCase } from '../application/use-cases/delete-position.use-case';
import { FilterPositionUseCase } from '../application/use-cases/filter-position.use-case';
import { FindPositionByIdUseCase } from '../application/use-cases/find-position-by-id.use-case';
import { UpdatePositionUseCase } from '../application/use-cases/update-position.use-case';
import { CreatePositionDto } from './dto/request/create-position.dto';
import { FilterPositionDto } from './dto/request/filter-position.dto';
import { UpdatePositionDto } from './dto/request/update-position.dto';
import { PositionResDto } from './dto/response/position.res.dto';

@Controller({ path: 'positions', version: '1' })
@ApiTags('Position APIs')
export class PositionController {
  constructor(
    private readonly createPositionUseCase: CreatePositionUseCase,
    private readonly findPositionByIdUseCase: FindPositionByIdUseCase,
    private readonly updatePositionUseCase: UpdatePositionUseCase,
    private readonly filterPositionUseCase: FilterPositionUseCase,
    private readonly deletePositionUseCase: DeletePositionUseCase,
  ) {}

  @Get()
  @ApiAuth({
    summary: 'Get list position',
    type: PositionResDto,
    paginationType: 'offset',
    isPaginated: true,
  })
  getListPosition(@Query() filter: FilterPositionDto) {
    return this.filterPositionUseCase.execute(filter);
  }

  @Get(':positionId')
  @ApiAuth({
    summary: 'Get position information',
    type: PositionResDto,
  })
  @ApiParam({
    name: 'positionId',
    description: 'The UUID of the position',
    type: 'string',
  })
  async findOnePosition(@Param('positionId', ValidateUuid) positionId: Uuid) {
    const result = await this.findPositionByIdUseCase.execute(positionId);
    return PositionMapper.toDto(result);
  }

  @Post()
  @ApiAuth({
    summary: 'Create a new position',
    statusCode: HttpStatus.CREATED,
    type: PositionResDto,
  })
  async createPosition(
    @Body() dto: CreatePositionDto,
    @CurrentOrganizationId() organizationId: Uuid,
  ) {
    dto.organizationId = organizationId;
    console.log(dto);
    const result = await this.createPositionUseCase.execute(dto);
    return PositionMapper.toDto(result);
  }

  @Put(':positionId')
  @ApiAuth({
    summary: 'Update position information',
    type: PositionResDto,
  })
  @ApiParam({
    name: 'positionId',
    description: 'The UUID of the position',
    type: 'string',
  })
  updatePosition(
    @Param('positionId', ValidateUuid) positionId: Uuid,
    @Body() dto: UpdatePositionDto,
  ) {
    return this.updatePositionUseCase.execute(positionId, dto);
  }

  @Delete(':positionId')
  @ApiAuth({
    summary: 'Delete a position',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @ApiParam({
    name: 'positionId',
    description: 'The UUID of the position',
    type: 'string',
  })
  removePosition(@Param('positionId', ValidateUuid) positionId: Uuid) {
    return this.deletePositionUseCase.execute(positionId);
  }
}
