import connectDB from '@/lib/mongodb';
import VideoNews from '@/lib/models/VideoNews';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const admin = searchParams.get('admin');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));

    const query = {};
    if (!admin) query.status = 'published';

    const [total, videos] = await Promise.all([
      VideoNews.countDocuments(query),
      VideoNews.find(query)
        .sort({ isFeatured: -1, order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return Response.json({ videos, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    if (decoded.role === 'reporter' && !decoded.permissions?.canUploadVideos) {
      return Response.json({ error: 'Forbidden: no video upload permission' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();
    const video = new VideoNews(data);
    await video.save();
    return Response.json({ video }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
