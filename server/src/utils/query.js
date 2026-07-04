export const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildSearchRegex = (value) => new RegExp(escapeRegex(value), 'i');

export const parseBoolean = (value) => value === true || value === 'true';

export const getAllowedSortField = (sortBy, allowedFields, fallback) =>
  allowedFields.has(sortBy) ? sortBy : fallback;
