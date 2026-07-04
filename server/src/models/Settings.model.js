import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    businessEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    businessPhone: { type: String, required: true, trim: true, index: true },
    whatsappNumber: { type: String, required: true, trim: true, index: true },
    address: String,
    city: String,
    state: String,
    pincode: String,
    workingHours: mongoose.Schema.Types.Mixed,
    socialLinks: {
      instagram: String,
      facebook: String,
      youtube: String,
      linkedin: String,
    },
    seo: {
      defaultTitle: String,
      defaultDescription: String,
      defaultKeywords: [String],
    },
    homepage: {
      heroTitle: String,
      heroSubtitle: String,
      featuredServiceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    },
    isMaintenanceMode: { type: Boolean, default: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true },
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
