import { ICurrentUser } from '@/common/interfaces';
import { Optional } from '@common/utils/optional';
import { AuthService } from '@modules/auth/auth.service';
import { CreateOrganizationDto } from '@modules/organization/dto/request/create-organization.dto';
import { OrganizationEntity } from '@modules/organization/entities/organization.entity';
import { OrganizationRepository } from '@modules/organization/repositories/organization.repository';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserOrganizationRepository } from '../repositories/user-organization.repository';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly userOrganizationRepository: UserOrganizationRepository,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async execute(dto: CreateOrganizationDto, currentUser: ICurrentUser) {
    dto.createdBy = currentUser.id;
    Optional.of(
      await this.organizationRepository.findOneBy({
        name: dto.name,
        createdBy: dto.createdBy,
      }),
    ).throwIfPresent(new ConflictException('Organization already exists'));

    const user = await this.userService.findUserById(dto.createdBy, {
      relations: ['roles'],
    });

    if (user.organizationId) {
      throw new BadRequestException('User already has an organization');
    }

    const org = new OrganizationEntity(dto);
    const savedOrg = await this.organizationRepository.save(org);

    await this.userOrganizationRepository.upsert(
      {
        userId: dto.createdBy,
        organizationId: savedOrg.id,
        isOwner: true,
        joinedAt: new Date(),
      },
      ['userId', 'organizationId'],
    );
    await this.userService.updateUser(dto.createdBy, {
      organizationId: savedOrg.id,
    });
    user.organizationId = savedOrg.id;
    return this.authService.createToken(user, currentUser.sessionId);
  }
}
