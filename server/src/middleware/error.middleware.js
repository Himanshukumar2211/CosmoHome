import mongoose from 'mongoose';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { isProduction } from '../config/env.config.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const errorMiddleware = (error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let errors = error.errors || [];

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(error.errors).map((item) => item.message);
  }

  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource identifier';
  }

  if (error?.code === 11000) {
    statusCode = 409;
    message = 'Duplicate resource value';
    errors = Object.keys(error.keyValue || {});
  }

  if (error instanceof multer.MulterError) {
    statusCode = 400;
    message = error.message;
  }

  if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Invalid or expired authentication token';
  }

  if (!(error instanceof ApiError)) {
    logger.error(message, { stack: error.stack });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    statusCode,
    stack: isProduction ? undefined : error.stack,
  });
};
