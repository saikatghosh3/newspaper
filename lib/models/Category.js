import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  color: { type: String, default: '#dc2626' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

CategorySchema.index({ isActive: 1, name: 1 });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
