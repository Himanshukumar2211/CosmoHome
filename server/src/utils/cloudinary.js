import cloudinary from '../config/cloudinary.config.js';

export const uploadToCloudinary = (filePath, folder) =>
  cloudinary.uploader.upload(filePath, { folder, resource_type: 'auto' });

export const deleteFromCloudinary = (publicId, resourceType = 'image') =>
  cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
