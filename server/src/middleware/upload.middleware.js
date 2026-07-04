import { upload } from '../config/multer.config.js';

export const singleUpload = (fieldName) => upload.single(fieldName);
export const arrayUpload = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);
export const fieldsUpload = (fields) => upload.fields(fields);
