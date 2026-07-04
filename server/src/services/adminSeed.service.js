import Admin from '../models/Admin.model.js';
import { env } from '../config/env.config.js';
import { ROLES } from '../constants/roles.constants.js';
import { logger } from '../utils/logger.js';

export const seedInitialAdmin = async ({ updateExisting = false } = {}) => {
  const seedValues = [env.adminSeedName, env.adminSeedEmail, env.adminSeedPassword];
  const hasAnySeedValue = seedValues.some(Boolean);
  const hasAllSeedValues = seedValues.every(Boolean);

  if (!hasAnySeedValue) {
    return null;
  }

  if (!hasAllSeedValues) {
    logger.warn('Admin seed skipped; ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, and ADMIN_SEED_PASSWORD are all required.');
    return null;
  }

  const email = env.adminSeedEmail.toLowerCase().trim();
  const existingAdmin = await Admin.findOne({ email }).select('_id email');

  if (existingAdmin) {
    if (updateExisting) {
      existingAdmin.name = env.adminSeedName.trim();
      existingAdmin.password = env.adminSeedPassword;
      existingAdmin.passwordChangedAt = new Date();
      await existingAdmin.save();
      logger.info('Existing admin updated from seed environment.', { email });
      return existingAdmin;
    }

    logger.info('Admin seed skipped; admin already exists.', { email });
    return existingAdmin;
  }

  const admin = await Admin.create({
    name: env.adminSeedName.trim(),
    email,
    password: env.adminSeedPassword,
    role: ROLES.ADMIN,
    isActive: true,
  });

  logger.info('Initial admin created from seed environment.', { email });
  return admin;
};
