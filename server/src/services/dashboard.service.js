import { BEAUTICIAN_STATUS } from '../constants/status.constants.js';
import Beautician from '../models/Beautician.model.js';
import Gallery from '../models/Gallery.model.js';
import Review from '../models/Review.model.js';
import Service from '../models/Service.model.js';

export const getDashboardStatsService = async () => {
  const [
    totalServices,
    activeServices,
    totalReviews,
    totalGalleryImages,
    pendingBeauticians,
    approvedBeauticians,
    rejectedBeauticians,
    recentApplications,
  ] = await Promise.all([
    Service.countDocuments(),
    Service.countDocuments({ isActive: true }),
    Review.countDocuments(),
    Gallery.countDocuments(),
    Beautician.countDocuments({ status: BEAUTICIAN_STATUS.PENDING }),
    Beautician.countDocuments({ status: BEAUTICIAN_STATUS.APPROVED }),
    Beautician.countDocuments({ status: BEAUTICIAN_STATUS.REJECTED }),
    Beautician.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName phone city status createdAt')
      .populate('reviewedBy', 'name email'),
  ]);

  return {
    totalServices,
    activeServices,
    totalReviews,
    totalGalleryImages,
    pendingBeauticians,
    approvedBeauticians,
    rejectedBeauticians,
    recentApplications,
  };
};
