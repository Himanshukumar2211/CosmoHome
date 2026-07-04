import {
  getPublicSettingsService,
  getSettingsService,
  updateSettingsService,
} from '../services/settings.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settings = req.admin ? await getSettingsService() : await getPublicSettingsService();

  res.status(200).json(new ApiResponse(200, { settings }, 'Settings fetched'));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await updateSettingsService(req.body, req.admin._id);

  res.status(200).json(new ApiResponse(200, { settings }, 'Settings updated'));
});
