import mongoose from 'mongoose';

const VideoNewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  description: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
}, { timestamps: true });

VideoNewsSchema.index({ status: 1, order: 1, createdAt: -1 });
VideoNewsSchema.index({ isFeatured: 1, status: 1 });

export default mongoose.models.VideoNews || mongoose.model('VideoNews', VideoNewsSchema);
