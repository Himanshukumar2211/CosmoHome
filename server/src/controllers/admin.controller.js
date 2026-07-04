import { AUTH_COOKIE_NAME } from '../constants/auth.constants.js';
import { buildAuthCookieOptions } from '../config/cookie.config.js';
import { loginAdminService, logoutAdminService, getAdminProfileService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const cookieMaxAge = 7 * 24 * 60 * 60 * 1000;

export const loginAdmin = asyncHandler(async (req, res) => {
  const { admin, token } = await loginAdminService(req.body);

  res
    .status(200)
    .cookie(AUTH_COOKIE_NAME, token, buildAuthCookieOptions(cookieMaxAge))
    .json(new ApiResponse(200, { admin }, 'Login successful'));
});

export const logoutAdmin = asyncHandler(async (_req, res) => {
  await logoutAdminService();

  res
    .status(200)
    .clearCookie(AUTH_COOKIE_NAME, buildAuthCookieOptions(0))
    .json(new ApiResponse(200, null, 'Logout successful'));
});

export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await getAdminProfileService(req.admin._id);

  res.status(200).json(new ApiResponse(200, { admin }, 'Admin profile fetched'));
});
