import connectDB from '@/lib/mongodb';
import Reader from '@/lib/models/Reader';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();
    const update = {};
    if (data.name !== undefined) update.name = data.name.trim();
    if (data.email !== undefined) update.email = data.email.trim().toLowerCase();
    if (data.phone !== undefined) update.phone = data.phone;
    if (data.address !== undefined) update.address = data.address;
    if (data.profilePicture !== undefined) update.profilePicture = data.profilePicture;
    if (data.isActive !== undefined) update.isActive = Boolean(data.isActive);

    if (data.password) {
      const reader = await Reader.findById(params.id);
      if (!reader) return Response.json({ error: 'Reader not found' }, { status: 404 });
      reader.password = data.password;
      Object.assign(reader, update);
      await reader.save();
      const result = reader.toObject();
      delete result.password;
      return Response.json({ reader: result });
    }

    const reader = await Reader.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    }).select('-password').lean();
    if (!reader) return Response.json({ error: 'Reader not found' }, { status: 404 });
    return Response.json({ reader });
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
    await Reader.findByIdAndDelete(params.id);
    return Response.json({ message: 'Reader deleted' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
