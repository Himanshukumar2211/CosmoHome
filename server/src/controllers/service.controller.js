import {
  createServiceService,
  deleteServiceService,
  listServicesService,
  updateServiceService,
} from '../services/service.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listServices = asyncHandler(async (req, res) => {
  const result = await listServicesService(req.query, Boolean(req.admin));

  res.status(200).json(new ApiResponse(200, result, 'Services fetched'));
});

export const createService = asyncHandler(async (req, res) => {
  const service = await createServiceService({
    body: req.body,
    file: req.file,
    adminId: req.admin._id,
  });

  res.status(201).json(new ApiResponse(201, { service }, 'Service created'));
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await updateServiceService({
    id: req.params.id,
    body: req.body,
    file: req.file,
    adminId: req.admin._id,
  });

  res.status(200).json(new ApiResponse(200, { service }, 'Service updated'));
});

export const deleteService = asyncHandler(async (req, res) => {
  await deleteServiceService(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Service deleted'));
});
