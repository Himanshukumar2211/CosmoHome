import { getDashboardStatsService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const stats = await getDashboardStatsService();

  res.status(200).json(new ApiResponse(200, { stats }, 'Dashboard stats fetched'));
});
