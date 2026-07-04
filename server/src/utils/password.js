import bcrypt from 'bcrypt';
import { env } from '../config/env.config.js';

export const hashPassword = (password) => bcrypt.hash(password, env.bcryptSaltRounds);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);
