import mongoose from 'mongoose';

const AdvertisementSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: '' },
  position: {
    type: String,
    enum: ['header', 'sidebar', 'footer', 'inline', 'popup'],
    default: 'sidebar',
  },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  clicks: { type: Number, default: 0 },
}, { timestamps: true });

AdvertisementSchema.index({ isActive: 1, position: 1, createdAt: -1 });

export default mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);
