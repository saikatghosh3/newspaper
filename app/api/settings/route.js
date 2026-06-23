import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create({});
    }
    return Response.json({ settings });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }
    return Response.json({ settings });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
