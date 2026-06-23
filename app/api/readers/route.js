import connectDB from '@/lib/mongodb';
import Reader from '@/lib/models/Reader';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));

    const query = {};
    const [total, readers] = await Promise.all([
      Reader.countDocuments(query),
      Reader.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return Response.json({ readers, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();

    if (!data.name || !data.email || !data.password) {
      return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const exists = await Reader.findOne({ email: data.email.trim().toLowerCase() }).lean();
    if (exists) {
      return Response.json({ error: 'A reader with this email already exists' }, { status: 409 });
    }

    const reader = new Reader({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      phone: data.phone || '',
      address: data.address || '',
      profilePicture: data.profilePicture || '',
      isActive: data.isActive !== false,
    });
    await reader.save();
    const result = reader.toObject();
    delete result.password;
    return Response.json({ reader: result }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
