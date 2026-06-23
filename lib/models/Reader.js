import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ReaderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

ReaderSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (typeof this.password === 'string' && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$'))) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

ReaderSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.Reader || mongoose.model('Reader', ReaderSchema);
