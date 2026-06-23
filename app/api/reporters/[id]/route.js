import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

function cleanReporterUpdate(data) {
  const update = {};
  if (data.name !== undefined) update.name = String(data.name).trim();
  if (data.email !== undefined) update.email = String(data.email).trim().toLowerCase();
  if (data.isActive !== undefined) update.isActive = Boolean(data.isActive);

  if (data.permissions) {
    update.permissions = {
      canCreateNews: Boolean(data.permissions.canCreateNews),
      canEditNews: Boolean(data.permissions.canEditNews),
      canDeleteNews: Boolean(data.permissions.canDeleteNews),
      canPublishNews: Boolean(data.permissions.canPublishNews),
      canFeatureNews: Boolean(data.permissions.canFeatureNews),
      canTrendNews: Boolean(data.permissions.canTrendNews),
      canManageCategories: false,
    };
  }

  return update;
}

export async function PUT(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();
    const update = cleanReporterUpdate(data);

    if (data.password) {
      const user = await User.findById(params.id);
      if (!user || user.role !== 'reporter') {
        return Response.json({ error: 'Reporter not found' }, { status: 404 });
      }
      user.password = data.password;
      Object.assign(user, update);
      await user.save();
      const result = user.toObject();
      delete result.password;
      return Response.json({ reporter: result });
    }
    const reporter = await User.findOneAndUpdate({ _id: params.id, role: 'reporter' }, update, {
      new: true,
      runValidators: true,
    }).select('-password').lean();
    if (!reporter) return Response.json({ error: 'Reporter not found' }, { status: 404 });
    return Response.json({ reporter });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    await User.findOneAndDelete({ _id: params.id, role: 'reporter' });
    return Response.json({ message: 'Reporter deleted' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
