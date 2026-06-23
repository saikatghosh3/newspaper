import connectDB from '@/lib/mongodb';
import Advertisement from '@/lib/models/Advertisement';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position');
    const admin = searchParams.get('admin');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));

    const query = {};
    if (!admin) query.isActive = true;
    if (position) query.position = position;

    const [total, ads] = await Promise.all([
      Advertisement.countDocuments(query),
      Advertisement.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return Response.json({ ads, total, page, pages: Math.ceil(total / limit) });
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
    const data = await req.json();
    const ad = new Advertisement(data);
    await ad.save();
    return Response.json({ ad }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
