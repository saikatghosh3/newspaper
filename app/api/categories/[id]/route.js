import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

function createSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function PUT(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();
    const update = {
      name: data.name,
      color: data.color,
      description: data.description,
    };

    Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);

    if (update.name) {
      update.name = update.name.trim();
      update.slug = createSlug(update.name);
    }

    const category = await Category.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    }).lean();
    if (!category) return Response.json({ error: 'Category not found' }, { status: 404 });

    return Response.json({ category });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    await Category.findByIdAndDelete(params.id);
    return Response.json({ message: 'Category deleted' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
