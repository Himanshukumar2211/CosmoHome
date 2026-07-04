import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 9000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 12),
  cookieSecret: process.env.COOKIE_SECRET || 'development-only-cookie-secret',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  adminSeedName: process.env.ADMIN_SEED_NAME || '',
  adminSeedEmail: process.env.ADMIN_SEED_EMAIL || '',
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD || '',
  adminSeedUpdateExisting: process.env.ADMIN_SEED_UPDATE_EXISTING === 'true',
};

export const isProduction = env.nodeEnv === 'production';
