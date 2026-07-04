export const unwrapApiData = (response, key) => {
  const payload = response?.data?.data ?? response?.data ?? {};
  if (key && payload?.[key] !== undefined) return payload[key];
  return payload;
};

export const unwrapApiList = (response, key) => {
  const payload = unwrapApiData(response);
  const list = key ? payload?.[key] : payload;

  if (Array.isArray(list)) return list;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.docs)) return payload.docs;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.services)) return payload.services;
  if (Array.isArray(payload?.galleryItems)) return payload.galleryItems;
  if (Array.isArray(payload?.reviews)) return payload.reviews;

  return [];
};

export const assetUrl = (asset) => {
  if (!asset) return '';
  if (typeof asset === 'string') return asset;
  return asset.url || asset.secure_url || '';
};
