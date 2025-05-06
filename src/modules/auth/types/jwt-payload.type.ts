export type JwtPayloadType = {
  id: string;
  roles: string[];
  sessionId: string;
  name: string;
  email: string;
  avatar?: string;
  currentOrganizationId?: string;
  iat?: number;
  exp?: number;
};
