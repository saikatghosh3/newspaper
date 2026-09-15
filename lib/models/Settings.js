import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'DailyNews' },
  logo: { type: String, default: '' },
  selectedLayout: { type: Number, enum: [1, 2, 3], default: 1 },
  footerText: { type: String, default: '' },
  socialLinks: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  breakingNews: { type: String, default: '' },
}, { timestamps: true });

SettingsSchema.index({});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
