import connectDB from '@/lib/mongodb';
import Advertisement from '@/lib/models/Advertisement';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const data = await req.json();
    const ad = await Advertisement.findByIdAndUpdate(params.id, data, { new: true }).lean();
    return Response.json({ ad });
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
    await Advertisement.findByIdAndDelete(params.id);
    return Response.json({ message: 'Deleted' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
