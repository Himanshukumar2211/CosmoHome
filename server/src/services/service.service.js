import { CLOUDINARY_FOLDERS } from '../constants/upload.constants.js';
import Service from '../models/Service.model.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';
import { buildSearchRegex, getAllowedSortField, parseBoolean } from '../utils/query.js';
import { slugify } from '../utils/slugify.js';
import { deleteFileService, uploadFileService } from './upload.service.js';

const allowedSortFields = new Set(['name', 'category', 'price', 'displayOrder', 'createdAt', 'updatedAt']);

const buildSlug = async (name, ignoredId) => {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (await Service.exists({ slug, ...(ignoredId ? { _id: { $ne: ignoredId } } : {}) })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

export const listServicesService = async (query = {}, isAdmin = false) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.category) {
    filter.category = buildSearchRegex(query.category);
  }

  if (query.search) {
    const search = buildSearchRegex(query.search);
    filter.$or = [{ name: search }, { description: search }, { category: search }];
  }

  if (query.featured !== undefined) {
    filter.isFeatured = parseBoolean(query.featured);
  }

  if (query.active !== undefined) {
    filter.isActive = parseBoolean(query.active);
  } else if (!isAdmin) {
    filter.isActive = true;
  }

  const sortBy = getAllowedSortField(query.sortBy, allowedSortFields, 'displayOrder');
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
  const [items, total, activeServices] = await Promise.all([
    Service.find(filter)
      .populate('createdBy updatedBy', 'name email')
      .sort({ [sortBy]: sortOrder, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Service.countDocuments(filter),
    Service.countDocuments({ isActive: true }),
  ]);

  return {
    items,
    activeServices,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const createServiceService = async ({ body, file, adminId }) => {
  const image = await uploadFileService(file, CLOUDINARY_FOLDERS.SERVICES);

  try {
    return await Service.create({
      ...body,
      slug: await buildSlug(body.name),
      image,
      createdBy: adminId,
      updatedBy: adminId,
    });
  } catch (error) {
    await deleteFileService(image);
    throw error;
  }
};

export const updateServiceService = async ({ id, body, file, adminId }) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  const nextName = body.name;
  const shouldUpdateSlug = nextName && nextName !== service.name;
  const oldImage = service.image;
  const newImage = await uploadFileService(file, CLOUDINARY_FOLDERS.SERVICES);

  try {
    Object.assign(service, body);

    if (shouldUpdateSlug) {
      service.slug = await buildSlug(nextName, id);
    }

    if (newImage) {
      service.image = newImage;
    }

    service.updatedBy = adminId;
    await service.save();

    if (newImage) {
      await deleteFileService(oldImage);
    }

    return service;
  } catch (error) {
    await deleteFileService(newImage);
    throw error;
  }
};

export const deleteServiceService = async (id) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  await deleteFileService(service.image);
  await service.deleteOne();

  return service;
};
