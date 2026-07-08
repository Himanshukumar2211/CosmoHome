import mongoose from 'mongoose';
import { env } from './env.config.js';
import { logger } from '../utils/logger.js';

const readyStateLabels = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

let connectionListenersRegistered = false;

export const getDatabaseStatus = () => {
  const { connection } = mongoose;

  return {
    configured: Boolean(env.mongoUri),
    readyState: connection.readyState,
    state: readyStateLabels[connection.readyState] || 'unknown',
    host: connection.host || null,
    name: connection.name || null,
  };
};

const registerConnectionListeners = () => {
  if (connectionListenersRegistered) {
    return;
  }

  connectionListenersRegistered = true;

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established', getDatabaseStatus());
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection disconnected', getDatabaseStatus());
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB connection reestablished', getDatabaseStatus());
  });

  mongoose.connection.on('close', () => {
    logger.warn('MongoDB connection closed', getDatabaseStatus());
  });

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error', {
      ...getDatabaseStatus(),
      message: error.message,
      name: error.name,
    });
  });
};

export const connectDatabase = async () => {
  registerConnectionListeners();

  if (!env.mongoUri) {
    logger.warn('MONGODB_URI is not configured; database connection skipped.');
    return null;
  }

  logger.info('MongoDB connection starting');
  const connection = await mongoose.connect(env.mongoUri);
  logger.info('MongoDB connected', getDatabaseStatus());
  return connection;
};
