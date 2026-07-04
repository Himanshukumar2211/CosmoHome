import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinary.js';
import { deleteLocalFile } from '../utils/deleteLocalFile.js';

export const uploadFileService = async (file, folder) => {
  if (!file) {
    return null;
  }

  try {
    const uploaded = await uploadToCloudinary(file.path, folder);

    return {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      resourceType: uploaded.resource_type,
      name: file.originalname,
      type: file.mimetype,
    };
  } finally {
    await deleteLocalFile(file.path);
  }
};

export const uploadFilesService = async (files = [], folder) => {
  const uploadedFiles = [];

  try {
    for (const file of files) {
      const uploadedFile = await uploadFileService(file, folder);
      uploadedFiles.push(uploadedFile);
    }

    return uploadedFiles;
  } catch (error) {
    await deleteFilesService(uploadedFiles);
    throw error;
  }
};

export const deleteFileService = async (asset) => {
  if (!asset?.publicId) {
    return false;
  }

  return deleteFromCloudinary(asset.publicId, asset.resourceType || 'image');
};

export const deleteFilesService = async (assets = []) =>
  Promise.all(assets.filter(Boolean).map((asset) => deleteFileService(asset)));
