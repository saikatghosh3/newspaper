import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST() {
  try {
    await connectDB();

    const existing = await User.findOne({ role: 'superadmin' }).lean();
    if (existing) {
      return Response.json({ error: 'Superadmin already exists' }, { status: 400 });
    }

    const email = 'admin@dailynews.com'.trim().toLowerCase();
    const superadmin = new User({
      name: 'Super Admin',
      email,
      password: 'Admin@123456',
      role: 'superadmin',
      permissions: {
        canCreateNews: true,
        canEditNews: true,
        canDeleteNews: true,
        canPublishNews: true,
        canFeatureNews: true,
        canTrendNews: true,
        canManageCategories: true,
      },
    });

    await superadmin.save();
    return Response.json({ message: 'Superadmin created successfully', email: 'admin@dailynews.com', password: 'Admin@123456' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
