import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const user = await User.findById(decoded.id).select('-password').lean();
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    return Response.json({ user });
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
