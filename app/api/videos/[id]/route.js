import connectDB from '@/lib/mongodb';
import VideoNews from '@/lib/models/VideoNews';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const video = await VideoNews.findById(params.id).lean();
    if (!video) return Response.json({ error: 'Video not found' }, { status: 404 });
    return Response.json({ video });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    if (decoded.role === 'reporter' && !decoded.permissions?.canEditVideos) {
      return Response.json({ error: 'Forbidden: no video edit permission' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();
    const video = await VideoNews.findByIdAndUpdate(params.id, data, { new: true }).lean();
    return Response.json({ video });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    if (decoded.role === 'reporter' && !decoded.permissions?.canDeleteVideos) {
      return Response.json({ error: 'Forbidden: no video delete permission' }, { status: 403 });
    }

    await connectDB();
    await VideoNews.findByIdAndDelete(params.id);
    return Response.json({ message: 'Deleted' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
