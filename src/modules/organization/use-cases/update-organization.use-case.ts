import { ErrorCode } from '@/common/constants/error-code';
import { ICurrentUser } from '@/common/interfaces';
import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrganizationDto } from '../dto/request/update-organization.dto';
import { OrganizationEntity } from '../entities/organization.entity';
import { OrganizationRepository } from '../repositories/organization.repository';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(
    id: Uuid,
    dto: UpdateOrganizationDto,
    currentUser: ICurrentUser,
  ): Promise<OrganizationEntity> {
    const org = Optional.of(await this.repository.findById(id))
      .throwIfNullable(new NotFoundException('Organization not found'))
      .get<OrganizationEntity>();

    if (!org.canUpdate(currentUser.id)) {
      throw new ForbiddenException(ErrorCode.FORBIDDEN);
    }

    if (dto.name) {
      Optional.of(
        await this.repository.findOneBy({
          name: dto.name,
          createdBy: dto.createdBy,
        }),
      ).throwIfPresent(
        new ConflictException(
          `An organization with the name ${dto.name} already exists under your account. Please use a different name.`,
        ),
      );
    }

    Object.assign(org, dto);
    return this.repository.save(org);
  }
}
