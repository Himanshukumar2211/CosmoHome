import morgan from 'morgan';
import { isProduction } from '../config/env.config.js';

export const requestLogger = morgan(isProduction ? 'combined' : 'dev');
