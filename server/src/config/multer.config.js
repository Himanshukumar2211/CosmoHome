import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError.js';

const storage = multer.diskStorage({
  destination: 'src/uploads/temp',
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new ApiError(400, 'Unsupported file type'));
      return;
    }

    callback(null, true);
  },
});
