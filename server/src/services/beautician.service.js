import { BEAUTICIAN_STATUS } from '../constants/status.constants.js';
import { CLOUDINARY_FOLDERS } from '../constants/upload.constants.js';
import Beautician from '../models/Beautician.model.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';
import { buildSearchRegex, getAllowedSortField } from '../utils/query.js';
import { deleteFilesService, uploadFileService, uploadFilesService } from './upload.service.js';

const allowedSortFields = new Set(['fullName', 'city', 'status', 'experienceYears', 'createdAt', 'updatedAt']);

const asArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const buildAssetList = (beautician) => [
  beautician.profilePhoto,
  beautician.governmentId,
  ...(beautician.portfolioImages || []),
  ...(beautician.certificates || []),
];

export const registerBeauticianService = async ({ body, files }) => {
  const profilePhotoFile = files?.profilePhoto?.[0];
  const governmentIdFile = files?.governmentId?.[0];

  if (!profilePhotoFile || !governmentIdFile) {
    throw new ApiError(400, 'Profile photo and government ID are required');
  }

  const profilePhoto = await uploadFileService(profilePhotoFile, CLOUDINARY_FOLDERS.BEAUTICIAN_PROFILE);
  const governmentId = await uploadFileService(governmentIdFile, CLOUDINARY_FOLDERS.BEAUTICIAN_GOVERNMENT_IDS);
  const portfolioImages = await uploadFilesService(
    files?.portfolioImages || [],
    CLOUDINARY_FOLDERS.BEAUTICIAN_PORTFOLIO,
  );
  const certificates = await uploadFilesService(
    files?.certificates || [],
    CLOUDINARY_FOLDERS.BEAUTICIAN_CERTIFICATES,
  );

  try {
    return await Beautician.create({
      ...body,
      specializations: asArray(body.specializations),
      profilePhoto,
      governmentId,
      portfolioImages,
      certificates,
    });
  } catch (error) {
    await deleteFilesService([profilePhoto, governmentId, ...portfolioImages, ...certificates]);
    throw error;
  }
};

export const listBeauticiansService = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.city) {
    filter.city = buildSearchRegex(query.city);
  }

  if (query.search) {
    const search = buildSearchRegex(query.search);
    filter.$or = [{ fullName: search }, { phone: search }, { email: search }, { city: search }];
  }

  const sortBy = getAllowedSortField(query.sortBy, allowedSortFields, 'createdAt');
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const [items, total] = await Promise.all([
    Beautician.find(filter)
      .populate('reviewedBy', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Beautician.countDocuments(filter),
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

export const getBeauticianService = async (id) => {
  const beautician = await Beautician.findById(id).populate('reviewedBy', 'name email');

  if (!beautician) {
    throw new ApiError(404, 'Beautician application not found');
  }

  return beautician;
};

export const updateBeauticianService = async ({ id, body, files, adminId }) => {
  const beautician = await Beautician.findById(id);

  if (!beautician) {
    throw new ApiError(404, 'Beautician application not found');
  }

  const oldProfilePhoto = beautician.profilePhoto;
  const oldGovernmentId = beautician.governmentId;
  const oldPortfolioImages = beautician.portfolioImages || [];
  const oldCertificates = beautician.certificates || [];
  const uploadedAssets = [];

  const profilePhoto = await uploadFileService(files?.profilePhoto?.[0], CLOUDINARY_FOLDERS.BEAUTICIAN_PROFILE);
  const governmentId = await uploadFileService(files?.governmentId?.[0], CLOUDINARY_FOLDERS.BEAUTICIAN_GOVERNMENT_IDS);
  const portfolioImages = await uploadFilesService(
    files?.portfolioImages || [],
    CLOUDINARY_FOLDERS.BEAUTICIAN_PORTFOLIO,
  );
  const certificates = await uploadFilesService(
    files?.certificates || [],
    CLOUDINARY_FOLDERS.BEAUTICIAN_CERTIFICATES,
  );

  uploadedAssets.push(profilePhoto, governmentId, ...portfolioImages, ...certificates);

  try {
    Object.assign(beautician, {
      ...body,
      ...(body.specializations !== undefined ? { specializations: asArray(body.specializations) } : {}),
    });

    if (profilePhoto) {
      beautician.profilePhoto = profilePhoto;
    }

    if (governmentId) {
      beautician.governmentId = governmentId;
    }

    if (portfolioImages.length) {
      beautician.portfolioImages = portfolioImages;
    }

    if (certificates.length) {
      beautician.certificates = certificates;
    }

    if (body.status === BEAUTICIAN_STATUS.APPROVED) {
      beautician.approvedAt = new Date();
      beautician.rejectedAt = undefined;
      beautician.rejectionReason = undefined;
    }

    if (body.status === BEAUTICIAN_STATUS.REJECTED) {
      beautician.rejectedAt = new Date();
      beautician.approvedAt = undefined;
    }

    if (body.status === BEAUTICIAN_STATUS.PENDING) {
      beautician.approvedAt = undefined;
      beautician.rejectedAt = undefined;
      beautician.rejectionReason = undefined;
    }

    beautician.reviewedBy = adminId;
    await beautician.save();

    await deleteFilesService([
      profilePhoto ? oldProfilePhoto : null,
      governmentId ? oldGovernmentId : null,
      ...(portfolioImages.length ? oldPortfolioImages : []),
      ...(certificates.length ? oldCertificates : []),
    ]);

    return beautician.populate('reviewedBy', 'name email');
  } catch (error) {
    await deleteFilesService(uploadedAssets);
    throw error;
  }
};

export const approveBeauticianService = async (id, adminId) => {
  const beautician = await Beautician.findById(id);

  if (!beautician) {
    throw new ApiError(404, 'Beautician application not found');
  }

  beautician.status = BEAUTICIAN_STATUS.APPROVED;
  beautician.approvedAt = new Date();
  beautician.rejectedAt = undefined;
  beautician.rejectionReason = undefined;
  beautician.reviewedBy = adminId;

  await beautician.save();
  return beautician.populate('reviewedBy', 'name email');
};

export const rejectBeauticianService = async (id, adminId, rejectionReason) => {
  const beautician = await Beautician.findById(id);

  if (!beautician) {
    throw new ApiError(404, 'Beautician application not found');
  }

  beautician.status = BEAUTICIAN_STATUS.REJECTED;
  beautician.rejectedAt = new Date();
  beautician.approvedAt = undefined;
  beautician.rejectionReason = rejectionReason;
  beautician.reviewedBy = adminId;

  await beautician.save();
  return beautician.populate('reviewedBy', 'name email');
};

export const deleteBeauticianService = async (id) => {
  const beautician = await Beautician.findById(id);

  if (!beautician) {
    throw new ApiError(404, 'Beautician application not found');
  }

  await deleteFilesService(buildAssetList(beautician));
  await beautician.deleteOne();

  return beautician;
};
