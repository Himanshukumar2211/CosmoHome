import { isProduction } from './env.config.js';

export const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  signed: true,
};

export const buildAuthCookieOptions = (maxAge) => ({
  ...authCookieOptions,
  maxAge,
});
