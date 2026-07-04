import { CLOUDINARY_FOLDERS } from '../constants/upload.constants.js';
import Review from '../models/Review.model.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';
import { buildSearchRegex, getAllowedSortField, parseBoolean } from '../utils/query.js';
import { deleteFileService, uploadFileService } from './upload.service.js';

const allowedSortFields = new Set(['customerName', 'rating', 'createdAt', 'updatedAt']);

export const listReviewsService = async (query = {}, isAdmin = false) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (!isAdmin) {
    filter.isApproved = true;
  }

  if (query.approved !== undefined && isAdmin) {
    filter.isApproved = parseBoolean(query.approved);
  }

  if (query.featured !== undefined) {
    filter.isFeatured = parseBoolean(query.featured);
  }

  if (query.search) {
    const search = buildSearchRegex(query.search);
    filter.$or = [{ customerName: search }, { comment: search }, { serviceName: search }, { customerLocation: search }];
  }

  const sortBy = getAllowedSortField(query.sortBy, allowedSortFields, 'createdAt');
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const [items, total] = await Promise.all([
    Review.find(filter).sort({ isFeatured: -1, [sortBy]: sortOrder }).skip(skip).limit(limit),
    Review.countDocuments(filter),
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

export const createReviewService = async ({ body, file, admin }) => {
  const image = await uploadFileService(file, CLOUDINARY_FOLDERS.REVIEWS);

  try {
    return await Review.create({
      ...body,
      image,
      createdByAdmin: Boolean(admin),
      isApproved: Boolean(admin),
    });
  } catch (error) {
    await deleteFileService(image);
    throw error;
  }
};

export const updateReviewService = async ({ id, body, file }) => {
  const review = await Review.findById(id);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  const oldImage = review.image;
  const newImage = await uploadFileService(file, CLOUDINARY_FOLDERS.REVIEWS);

  try {
    Object.assign(review, body);

    if (newImage) {
      review.image = newImage;
    }

    await review.save();

    if (newImage) {
      await deleteFileService(oldImage);
    }
  } catch (error) {
    await deleteFileService(newImage);
    throw error;
  }

  return review;
};

export const deleteReviewService = async (id) => {
  const review = await Review.findById(id);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  await deleteFileService(review.image);
  await review.deleteOne();

  return review;
};
