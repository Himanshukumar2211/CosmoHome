import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: String,
  },
  { _id: false },
);

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, maxlength: 500 },
    image: { type: assetSchema, required: true },
    category: { type: String, required: true, trim: true, index: true },
    tags: [String],
    isActive: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0, index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true },
);

gallerySchema.index({ createdAt: -1 });

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
