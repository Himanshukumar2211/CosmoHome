import {
  createReviewService,
  deleteReviewService,
  listReviewsService,
  updateReviewService,
} from '../services/review.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listReviews = asyncHandler(async (req, res) => {
  const result = await listReviewsService(req.query, Boolean(req.admin));

  res.status(200).json(new ApiResponse(200, result, 'Reviews fetched'));
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await createReviewService({
    body: req.body,
    file: req.file,
    admin: req.admin,
  });

  res.status(201).json(new ApiResponse(201, { review }, 'Review created'));
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await updateReviewService({ id: req.params.id, body: req.body, file: req.file });

  res.status(200).json(new ApiResponse(200, { review }, 'Review updated'));
});

export const deleteReview = asyncHandler(async (req, res) => {
  await deleteReviewService(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Review deleted'));
});
