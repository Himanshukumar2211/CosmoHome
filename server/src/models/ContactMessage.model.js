import mongoose from 'mongoose';
import { CONTACT_MESSAGE_STATUS } from '../constants/status.constants.js';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    phone: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    message: { type: String, required: true, minlength: 10, maxlength: 2000 },
    source: {
      type: String,
      enum: ['contact_page', 'whatsapp_cta', 'service_page'],
      default: 'contact_page',
    },
    status: {
      type: String,
      enum: Object.values(CONTACT_MESSAGE_STATUS),
      default: CONTACT_MESSAGE_STATUS.NEW,
      index: true,
    },
  },
  { timestamps: true },
);

contactMessageSchema.index({ createdAt: -1 });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
