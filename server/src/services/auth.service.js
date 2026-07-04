import Admin from '../models/Admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import { comparePassword } from '../utils/password.js';
import { createAdminTokenService } from './token.service.js';

const sanitizeAdmin = (admin) => {
  const object = admin.toObject ? admin.toObject() : admin;
  delete object.password;
  return object;
};

export const loginAdminService = async ({ email, password }) => {
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  if (!admin || !admin.isActive) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, admin.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = await createAdminTokenService(admin);

  return {
    admin: sanitizeAdmin(admin),
    token,
  };
};

export const logoutAdminService = async () => true;

export const getAdminProfileService = async (adminId) => {
  const admin = await Admin.findById(adminId).select('-password');

  if (!admin || !admin.isActive) {
    throw new ApiError(401, 'Unauthorized');
  }

  return admin;
};
