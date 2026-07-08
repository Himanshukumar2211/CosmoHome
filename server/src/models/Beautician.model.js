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
    alternatePhone: { type: String, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    gender: { type: String, enum: ['female', 'male', 'other'] },
    dateOfBirth: Date,
    fathersHusbandName: { type: String, trim: true, minlength: 2, maxlength: 100 },
    aadhaarNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    experienceYears: { type: Number, required: true, min: 0, max: 50 },
    currentProfession: { type: String, trim: true, maxlength: 100 },
    workPreference: { type: String, enum: ['part-time', 'full-time'] },
    specializations: {
      type: [String],
      required: true,
      validate: [(value) => value.length > 0, 'At least one specialization is required'],
    },
    otherService: { type: String, trim: true, maxlength: 100 },
    workedInSalonBefore: { type: String, enum: ['yes', 'no'] },
    previousSalonName: { type: String, trim: true, maxlength: 200 },
    ownToolsProducts: { type: String, enum: ['yes', 'no'] },
    preferredWorkAreas: { type: String, trim: true, maxlength: 300 },
    address: { type: String, required: true, maxlength: 500 },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    profilePhoto: { type: assetSchema, required: true },
    portfolioImages: [assetSchema],
    certificates: [assetSchema],
    governmentId: { type: assetSchema, required: true },
    addressProof: assetSchema,
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
    declarationAccepted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

beauticianSchema.index({ createdAt: -1 });

const Beautician = mongoose.model('Beautician', beauticianSchema);

export default Beautician;
