import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';
import { deleteLocalFile } from '../utils/deleteLocalFile.js';

const getUploadedFiles = (req) => {
  if (req.file) {
    return [req.file];
  }

  if (Array.isArray(req.files)) {
    return req.files;
  }

  if (req.files && typeof req.files === 'object') {
    return Object.values(req.files).flat();
  }

  return [];
};

export const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new ApiError(
      400,
      'Validation failed',
      result.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    );

    Promise.all(getUploadedFiles(req).map((file) => deleteLocalFile(file.path))).finally(() => next(error));
    return;
  }

  next();
};
