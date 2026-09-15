import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  news: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  reader: { type: mongoose.Schema.Types.ObjectId, ref: 'Reader' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
}, { timestamps: true });

ReviewSchema.index({ news: 1, status: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
