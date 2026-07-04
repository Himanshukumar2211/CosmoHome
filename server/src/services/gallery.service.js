import { CLOUDINARY_FOLDERS } from '../constants/upload.constants.js';
import Gallery from '../models/Gallery.model.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';
import { buildSearchRegex, getAllowedSortField, parseBoolean } from '../utils/query.js';
import { deleteFileService, uploadFileService } from './upload.service.js';

const allowedSortFields = new Set(['title', 'category', 'displayOrder', 'createdAt', 'updatedAt']);

const parseTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags;
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

export const listGalleryService = async (query = {}, isAdmin = false) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.category) {
    filter.category = buildSearchRegex(query.category);
  }

  if (query.search) {
    const search = buildSearchRegex(query.search);
    filter.$or = [{ title: search }, { description: search }, { category: search }, { tags: search }];
  }

  if (query.active !== undefined) {
    filter.isActive = parseBoolean(query.active);
  } else if (!isAdmin) {
    filter.isActive = true;
  }

  const sortBy = getAllowedSortField(query.sortBy, allowedSortFields, 'displayOrder');
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
  const [items, total] = await Promise.all([
    Gallery.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ [sortBy]: sortOrder, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Gallery.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const createGalleryItemService = async ({ body, file, adminId }) => {
  if (!file) {
    throw new ApiError(400, 'Gallery image is required');
  }

  const image = await uploadFileService(file, CLOUDINARY_FOLDERS.GALLERY);

  try {
    return await Gallery.create({
      ...body,
      tags: parseTags(body.tags),
      image,
      uploadedBy: adminId,
    });
  } catch (error) {
    await deleteFileService(image);
    throw error;
  }
};

export const updateGalleryItemService = async ({ id, body, file }) => {
  const galleryItem = await Gallery.findById(id);

  if (!galleryItem) {
    throw new ApiError(404, 'Gallery item not found');
  }

  const oldImage = galleryItem.image;
  const newImage = await uploadFileService(file, CLOUDINARY_FOLDERS.GALLERY);

  try {
    Object.assign(galleryItem, body);

    if (body.tags !== undefined) {
      galleryItem.tags = parseTags(body.tags);
    }

    if (newImage) {
      galleryItem.image = newImage;
    }

    await galleryItem.save();

    if (newImage) {
      await deleteFileService(oldImage);
    }

    return galleryItem.populate('uploadedBy', 'name email');
  } catch (error) {
    await deleteFileService(newImage);
    throw error;
  }
};

export const deleteGalleryItemService = async (id) => {
  const galleryItem = await Gallery.findById(id);

  if (!galleryItem) {
    throw new ApiError(404, 'Gallery item not found');
  }

  await deleteFileService(galleryItem.image);
  await galleryItem.deleteOne();

  return galleryItem;
};
