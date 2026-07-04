import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.config.js';
import { env } from '../config/env.config.js';
import { seedInitialAdmin } from '../services/adminSeed.service.js';
import { logger } from '../utils/logger.js';

const run = async () => {
  const connection = await connectDatabase();

  if (!connection) {
    throw new Error('MONGODB_URI is required to seed an admin.');
  }

  await seedInitialAdmin({ updateExisting: env.adminSeedUpdateExisting });
};

run()
  .catch((error) => {
    logger.error('Admin seed failed', { message: error.message, stack: error.stack });
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
