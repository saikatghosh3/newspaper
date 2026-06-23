import connectDB from '@/lib/mongodb';
import News from '@/lib/models/News';
import User from '@/lib/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const news = await News.findOneAndUpdate(
      { _id: params.id },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .lean();
    if (!news) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ news });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(decoded.id).select('role permissions').lean();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const existing = await News.findById(params.id).lean();
    if (!existing) return Response.json({ error: 'News not found' }, { status: 404 });

    const data = await req.json();
    const permissions = user.permissions || {};
    const isOwner = String(existing.author) === String(user._id);

    if (user.role !== 'superadmin') {
      if (!isOwner) {
        return Response.json({ error: 'You can only manage your own news' }, { status: 403 });
      }
      if (!permissions.canEditNews) {
        return Response.json({ error: 'You do not have permission to edit news' }, { status: 403 });
      }
      if (!permissions.canPublishNews && data.status === 'published') delete data.status;
      if (!permissions.canTrendNews) delete data.isTrending;
      if (!permissions.canFeatureNews) delete data.isFeatured;
    }

    if (data.status === 'published') {
      if (!existing.publishedAt) data.publishedAt = new Date();
    }

    const news = await News.findByIdAndUpdate(params.id, data, { new: true })
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .lean();

    return Response.json({ news });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(decoded.id).select('role permissions').lean();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const existing = await News.findById(params.id).lean();
    if (!existing) return Response.json({ error: 'News not found' }, { status: 404 });

    if (user.role !== 'superadmin') {
      const isOwner = String(existing.author) === String(user._id);
      if (!isOwner || !user.permissions?.canDeleteNews) {
        return Response.json({ error: 'You do not have permission to delete news' }, { status: 403 });
      }
    }

    await News.findByIdAndDelete(params.id);
    return Response.json({ message: 'Deleted successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
