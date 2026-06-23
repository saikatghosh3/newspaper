import mongoose from 'mongoose';

const PasswordResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reporterName: { type: String },
  status: { type: String, enum: ['pending', 'resolved', 'blocked'], default: 'pending' },
  resolvedAt: { type: Date },
  resolvedBy: { type: String },
  newPassword: { type: String },
}, { timestamps: true });

export default mongoose.models.PasswordReset || mongoose.model('PasswordReset', PasswordResetSchema);
