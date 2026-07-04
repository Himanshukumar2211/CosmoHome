import mongoose from 'mongoose';
import { env } from './env.config.js';
import { logger } from '../utils/logger.js';

export const connectDatabase = async () => {
  if (!env.mongoUri) {
    logger.warn('MONGODB_URI is not configured; database connection skipped.');
    return null;
  }

  const connection = await mongoose.connect(env.mongoUri);
  logger.info(`MongoDB connected: ${connection.connection.host}`);
  return connection;
};
