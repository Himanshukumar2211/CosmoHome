import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { getDatabaseStatus } from './config/db.config.js';
import { env } from './config/env.config.js';
import { corsOptions } from './config/cors.config.js';
import { apiRateLimiter } from './config/rateLimit.config.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { sanitizeRequest } from './middleware/sanitize.middleware.js';
import routes from './routes/index.routes.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(apiRateLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(env.cookieSecret));
app.use(sanitizeRequest);

app.get('/health', (_req, res) => {
  const database = getDatabaseStatus();
  const healthy = !database.configured || database.readyState === 1;

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    message: healthy ? 'Cosmo Home API is healthy' : 'Cosmo Home API database connection is unavailable',
    database,
  });
});

app.use('/api', routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
