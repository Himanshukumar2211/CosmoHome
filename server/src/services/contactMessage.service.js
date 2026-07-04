import ContactMessage from '../models/ContactMessage.model.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';
import { buildSearchRegex, getAllowedSortField } from '../utils/query.js';

const allowedSortFields = new Set(['name', 'status', 'source', 'createdAt', 'updatedAt']);

export const createContactMessageService = async (body) => ContactMessage.create(body);

export const listContactMessagesService = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search) {
    const search = buildSearchRegex(query.search);
    filter.$or = [{ name: search }, { phone: search }, { email: search }, { message: search }];
  }

  const sortBy = getAllowedSortField(query.sortBy, allowedSortFields, 'createdAt');
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const [items, total] = await Promise.all([
    ContactMessage.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit),
    ContactMessage.countDocuments(filter),
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

export const updateContactMessageService = async (id, body) => {
  const message = await ContactMessage.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!message) {
    throw new ApiError(404, 'Contact message not found');
  }

  return message;
};

export const deleteContactMessageService = async (id) => {
  const message = await ContactMessage.findById(id);

  if (!message) {
    throw new ApiError(404, 'Contact message not found');
  }

  await message.deleteOne();
  return message;
};
