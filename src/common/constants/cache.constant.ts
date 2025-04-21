export enum CacheKey {
  SESSION_BLACKLIST = 'auth:session-blacklist:%s', // %s: sessionId
  SESSION_HASH = 'auth:session-hash:%s', // %s: sessionId
  EMAIL_VERIFICATION = 'auth:token:%s:email-verification', // %s: userId
  PASSWORD_RESET = 'auth:token:%s:password', // %s: userId
  PASSWORD_RESET_PIN_CODE = 'user:%s:forgot-password-pin-code', // %s: userId
  REQUEST_DELETE = 'user:%s:request-delete', // %s: userId
  USER_PERMISSION = 'user:%s:user-permission', // %s: userId
}
