import connectDB from '@/lib/mongodb';
import News from '@/lib/models/News';
import User from '@/lib/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

const MAX_LIMIT = 100;

function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100) + '-' + Date.now();
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const trending = searchParams.get('trending');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), MAX_LIMIT);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const admin = searchParams.get('admin');

    const query = {};
    if (category) query.category = category;
    if (trending === 'true') query.isTrending = true;
    if (admin) {
      const token = getTokenFromRequest(req);
      const decoded = verifyToken(token);
      if (!decoded) return Response.json({ error: 'Unauthorized' }, { status: 401 });
      const user = await User.findById(decoded.id).select('role').lean();
      if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
      if (user.role === 'reporter') query.author = user._id;
      if (status) query.status = status;
    } else {
      query.status = 'published';
    }

    const [total, news] = await Promise.all([
      News.countDocuments(query),
      News.find(query)
        .populate('category', 'name slug color')
        .populate('author', 'name')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return Response.json({ news, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(decoded.id).select('role permissions').lean();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const permissions = user.permissions || {};
    if (user.role !== 'superadmin' && !permissions.canCreateNews) {
      return Response.json({ error: 'You do not have permission to create news' }, { status: 403 });
    }

    const data = await req.json();
    if (user.role !== 'superadmin') {
      if (!permissions.canPublishNews && data.status === 'published') data.status = 'draft';
      if (!permissions.canTrendNews) data.isTrending = false;
      if (!permissions.canFeatureNews) data.isFeatured = false;
    }
    const slug = makeSlug(data.title);

    const newsItem = new News({
      ...data,
      slug,
      author: decoded.id,
      publishedAt: data.status === 'published' ? new Date() : null,
    });
    await newsItem.save();
    return Response.json({ news: newsItem }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
