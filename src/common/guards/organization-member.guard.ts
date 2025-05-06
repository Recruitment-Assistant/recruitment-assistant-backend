// src/auth/guards/organization-member.guard.ts
import { OrganizationService } from '@/modules/organization/organization.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ICurrentUser } from '../interfaces';

@Injectable()
export class OrganizationMemberGuard implements CanActivate {
  constructor(private organizationService: OrganizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as ICurrentUser;

    if (!user) {
      throw new UnauthorizedException('User not authenticated.');
    }

    const currentOrganizationId = user.currentOrganizationId;

    if (!currentOrganizationId) {
      throw new ForbiddenException(
        'No active organization selected for this operation.',
      );
    }

    const isMember = await this.organizationService.isUserMemberOfOrganization(
      user.id,
      currentOrganizationId,
    );

    if (!isMember) {
      throw new ForbiddenException(
        `User is not a member of organization ${currentOrganizationId}.`,
      );
    }

    return true;
  }
}
