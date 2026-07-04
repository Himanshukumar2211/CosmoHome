import {
  createGalleryItemService,
  deleteGalleryItemService,
  listGalleryService,
  updateGalleryItemService,
} from '../services/gallery.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listGallery = asyncHandler(async (req, res) => {
  const result = await listGalleryService(req.query, Boolean(req.admin));

  res.status(200).json(new ApiResponse(200, result, 'Gallery fetched'));
});

export const createGalleryItem = asyncHandler(async (req, res) => {
  const galleryItem = await createGalleryItemService({
    body: req.body,
    file: req.file,
    adminId: req.admin._id,
  });

  res.status(201).json(new ApiResponse(201, { galleryItem }, 'Gallery item created'));
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const galleryItem = await updateGalleryItemService({
    id: req.params.id,
    body: req.body,
    file: req.file,
  });

  res.status(200).json(new ApiResponse(200, { galleryItem }, 'Gallery item updated'));
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  await deleteGalleryItemService(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Gallery item deleted'));
});
