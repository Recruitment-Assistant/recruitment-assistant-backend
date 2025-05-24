// src/common/decorators/current-organization-id.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICurrentUser } from '../interfaces';

export const CurrentOrganizationId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as ICurrentUser;

    if (!user || !user.organizationId) {
      return undefined;
    }
    return user.organizationId;
  },
);
