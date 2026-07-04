import { signToken, verifyToken } from '../utils/token.js';

export const createAdminTokenService = async (admin) =>
  signToken({ id: admin._id.toString(), role: admin.role });

export const verifyAdminTokenService = async (token) => verifyToken(token);
