import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

const reporterPermissions = {
  canCreateNews: true,
  canEditNews: false,
  canDeleteNews: false,
  canPublishNews: false,
  canFeatureNews: false,
  canTrendNews: false,
  canManageCategories: false,
};

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

    const query = { role: 'reporter' };
    const [total, reporters] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return Response.json({ reporters, total, page, pages: Math.ceil(total / limit) });
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
    const email = String(data.email || '').trim().toLowerCase();
    const name = String(data.name || '').trim();
    const password = String(data.password || '');

    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return Response.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const reporter = new User({
      name,
      email,
      password,
      role: 'reporter',
      isActive: data.isActive !== false,
      permissions: {
        ...reporterPermissions,
        ...(data.permissions || {}),
        canManageCategories: false,
      },
    });
    await reporter.save();
    const result = reporter.toObject();
    delete result.password;
    return Response.json({ reporter: result }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
