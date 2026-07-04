import {
  approveBeauticianService,
  deleteBeauticianService,
  getBeauticianService,
  listBeauticiansService,
  registerBeauticianService,
  rejectBeauticianService,
  updateBeauticianService,
} from '../services/beautician.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const registerBeautician = asyncHandler(async (req, res) => {
  const beautician = await registerBeauticianService({ body: req.body, files: req.files });

  res.status(201).json(new ApiResponse(201, { beautician }, 'Beautician application submitted'));
});

export const listBeauticians = asyncHandler(async (req, res) => {
  const result = await listBeauticiansService(req.query);

  res.status(200).json(new ApiResponse(200, result, 'Beauticians fetched'));
});

export const getBeautician = asyncHandler(async (req, res) => {
  const beautician = await getBeauticianService(req.params.id);

  res.status(200).json(new ApiResponse(200, { beautician }, 'Beautician fetched'));
});

export const updateBeautician = asyncHandler(async (req, res) => {
  const beautician = await updateBeauticianService({
    id: req.params.id,
    body: req.body,
    files: req.files,
    adminId: req.admin._id,
  });

  res.status(200).json(new ApiResponse(200, { beautician }, 'Beautician updated'));
});

export const approveBeautician = asyncHandler(async (req, res) => {
  const beautician = await approveBeauticianService(req.params.id, req.admin._id);

  res.status(200).json(new ApiResponse(200, { beautician }, 'Beautician approved'));
});

export const rejectBeautician = asyncHandler(async (req, res) => {
  const beautician = await rejectBeauticianService(req.params.id, req.admin._id, req.body.rejectionReason);

  res.status(200).json(new ApiResponse(200, { beautician }, 'Beautician rejected'));
});

export const deleteBeautician = asyncHandler(async (req, res) => {
  await deleteBeauticianService(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Beautician application deleted'));
});
