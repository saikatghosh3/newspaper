import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get('admin');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));

    const query = {};
    if (!admin) query.isActive = true;

    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return Response.json({ categories, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 });
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
    const slug = data.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');

    const category = new Category({ ...data, slug });
    await category.save();
    return Response.json({ category }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
