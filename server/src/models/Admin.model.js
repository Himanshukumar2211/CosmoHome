import mongoose from 'mongoose';
import { ROLES } from '../constants/roles.constants.js';
import { hashPassword } from '../utils/password.js';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.ADMIN,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true },
);

adminSchema.pre('save', async function hashPasswordBeforeSave(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  this.password = await hashPassword(this.password);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
