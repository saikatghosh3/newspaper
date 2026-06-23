import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'reporter'], default: 'reporter' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  permissions: {
    canCreateNews: { type: Boolean, default: true },
    canEditNews: { type: Boolean, default: false },
    canDeleteNews: { type: Boolean, default: false },
    canPublishNews: { type: Boolean, default: false },
    canFeatureNews: { type: Boolean, default: false },
    canTrendNews: { type: Boolean, default: false },
    canManageCategories: { type: Boolean, default: false },
  },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (typeof this.password === 'string' && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$'))) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  if (typeof this.password === 'string' && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$'))) {
    return bcrypt.compare(password, this.password);
  }
  return password === this.password;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
