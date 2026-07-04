import app from './app.js';
import { connectDatabase } from './config/db.config.js';
import { env } from './config/env.config.js';
import { seedInitialAdmin } from './services/adminSeed.service.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  const connection = await connectDatabase();

  if (connection) {
    await seedInitialAdmin();
  }

  app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  logger.error('Server startup failed', { message: error.message, stack: error.stack });
  process.exit(1);
});
