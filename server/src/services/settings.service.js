import Settings from '../models/Settings.model.js';

const publicProjection = '-updatedBy';

const defaultSettings = {
  businessName: 'Cosmo Home',
  businessPhone: '0000000000',
  whatsappNumber: '0000000000',
};

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

  return value;
};

const normalizeSettingsPayload = (body) => {
  const payload = { ...body };

  if (payload.seo?.defaultKeywords !== undefined) {
    payload.seo = {
      ...payload.seo,
      defaultKeywords: asArray(payload.seo.defaultKeywords),
    };
  }

  if (payload.homepage?.featuredServiceIds !== undefined) {
    payload.homepage = {
      ...payload.homepage,
      featuredServiceIds: asArray(payload.homepage.featuredServiceIds),
    };
  }

  return payload;
};

export const getSettingsService = async () => {
  const settings = await Settings.findOneAndUpdate({}, { $setOnInsert: defaultSettings }, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  }).populate('homepage.featuredServiceIds updatedBy', 'name email');

  return settings;
};

export const getPublicSettingsService = async () =>
  Settings.findOneAndUpdate({}, { $setOnInsert: defaultSettings }, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
    projection: publicProjection,
  }).populate('homepage.featuredServiceIds');

export const updateSettingsService = async (body, adminId) => {
  const payload = normalizeSettingsPayload(body);
  const settings = await Settings.findOneAndUpdate(
    {},
    {
      $set: {
        ...payload,
        updatedBy: adminId,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).populate('homepage.featuredServiceIds updatedBy', 'name email');

  return settings;
};
