import mongoose from 'mongoose';
import { BEAUTICIAN_STATUS } from '../constants/status.constants.js';

const assetSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: String,
    name: String,
    type: String,
  },
  { _id: false },
);

const beauticianSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    phone: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    gender: { type: String, enum: ['female', 'male', 'other'] },
    experienceYears: { type: Number, required: true, min: 0, max: 50 },
    specializations: {
      type: [String],
      required: true,
      validate: [(value) => value.length > 0, 'At least one specialization is required'],
    },
    address: { type: String, required: true, maxlength: 500 },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    profilePhoto: { type: assetSchema, required: true },
    portfolioImages: [assetSchema],
    certificates: [assetSchema],
    governmentId: { type: assetSchema, required: true },
    status: {
      type: String,
      enum: Object.values(BEAUTICIAN_STATUS),
      default: BEAUTICIAN_STATUS.PENDING,
      index: true,
    },
    rejectionReason: String,
    approvedAt: Date,
    rejectedAt: Date,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true },
);

beauticianSchema.index({ createdAt: -1 });

const Beautician = mongoose.model('Beautician', beauticianSchema);

export default Beautician;
