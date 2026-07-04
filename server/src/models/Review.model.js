import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: String,
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    rating: { type: Number, required: true, min: 1, max: 5, index: true },
    comment: { type: String, required: true, minlength: 10, maxlength: 1000 },
    serviceName: String,
    customerLocation: String,
    image: assetSchema,
    isApproved: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    createdByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
