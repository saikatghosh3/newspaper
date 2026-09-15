import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  featuredImage: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published', 'unpublished'], default: 'draft' },
  isTrending: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  newsHighlight: { type: String, default: '' },
  views: { type: Number, default: 0 },
  publishedAt: { type: Date },
}, { timestamps: true });

NewsSchema.index({ status: 1, publishedAt: -1, createdAt: -1 });
NewsSchema.index({ category: 1, status: 1, publishedAt: -1, createdAt: -1 });
NewsSchema.index({ isTrending: 1, status: 1, publishedAt: -1 });
NewsSchema.index({ slug: 1, status: 1 });
NewsSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.models.News || mongoose.model('News', NewsSchema);
