import Admin from '../models/Admin.model.js';
import { AUTH_COOKIE_NAME } from '../constants/auth.constants.js';
import { RESPONSE_MESSAGES } from '../constants/response.constants.js';
import { verifyAdminTokenService } from '../services/token.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticateAdmin = asyncHandler(async (req, _res, next) => {
  const token = req.signedCookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    throw new ApiError(401, RESPONSE_MESSAGES.UNAUTHORIZED);
  }

  const decoded = await verifyAdminTokenService(token);
  const admin = await Admin.findById(decoded.id).select('-password');

  if (!admin || !admin.isActive) {
    throw new ApiError(401, RESPONSE_MESSAGES.UNAUTHORIZED);
  }

  req.admin = admin;
  next();
});

export const optionalAuthenticateAdmin = asyncHandler(async (req, _res, next) => {
  const token = req.signedCookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    next();
    return;
  }

  let decoded;

  try {
    decoded = await verifyAdminTokenService(token);
  } catch {
    next();
    return;
  }

  const admin = await Admin.findById(decoded.id).select('-password');

  if (!admin || !admin.isActive) {
    next();
    return;
  }

  req.admin = admin;
  next();
});
