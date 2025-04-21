export type JwtPayloadType = {
  id: string;
  roles: string[];
  sessionId: string;
  iat?: number;
  exp?: number;
};
