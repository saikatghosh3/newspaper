import connectDB from '@/lib/mongodb';
import Review from '@/lib/models/Review';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const data = await req.json();
    const review = await Review.findByIdAndUpdate(params.id, data, { new: true }).lean();
    return Response.json({ review });
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
    await Review.findByIdAndDelete(params.id);
    return Response.json({ message: 'Review deleted' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
