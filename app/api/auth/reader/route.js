import connectDB from '@/lib/mongodb';
import Reader from '@/lib/models/Reader';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

function signToken(reader) {
  return jwt.sign(
    { id: reader._id, email: reader.email, name: reader.name, role: 'reader' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export async function POST(req) {
  try {
    await connectDB();
    const { action, name, email, password } = await req.json();

    if (action === 'register') {
      if (!name || !email || !password) {
        return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
      }
      if (password.length < 6) {
        return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      }
      const exists = await Reader.findOne({ email: email.trim().toLowerCase() }).lean();
      if (exists) {
        return Response.json({ error: 'An account with this email already exists' }, { status: 409 });
      }
      const reader = new Reader({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      await reader.save();
      const token = signToken(reader);
      return Response.json({
        token,
        reader: { id: reader._id, name: reader.name, email: reader.email, phone: '', address: '', profilePicture: '' },
      }, { status: 201 });
    }

    if (action === 'login') {
      if (!email || !password) {
        return Response.json({ error: 'Email and password are required' }, { status: 400 });
      }
      const reader = await Reader.findOne({ email: email.trim().toLowerCase(), isActive: true });
      if (!reader) {
        return Response.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      const isValid = await reader.comparePassword(password);
      if (!isValid) {
        return Response.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      const token = signToken(reader);
      return Response.json({
        token,
        reader: {
          id: reader._id,
          name: reader.name,
          email: reader.email,
          phone: reader.phone || '',
          address: reader.address || '',
          profilePicture: reader.profilePicture || '',
        },
      });
    }

    return Response.json({ error: 'Invalid action. Use "register" or "login".' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET);
    if (!decoded || decoded.role !== 'reader') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const reader = await Reader.findById(decoded.id).select('-password').lean();
    if (!reader) {
      return Response.json({ error: 'Reader not found' }, { status: 404 });
    }

    return Response.json({
      reader: {
        id: reader._id,
        name: reader.name,
        email: reader.email,
        phone: reader.phone || '',
        address: reader.address || '',
        profilePicture: reader.profilePicture || '',
      },
    });
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET);
    if (!decoded || decoded.role !== 'reader') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const update = {};
    if (data.name !== undefined) update.name = data.name.trim();
    if (data.phone !== undefined) update.phone = data.phone;
    if (data.address !== undefined) update.address = data.address;
    if (data.profilePicture !== undefined) update.profilePicture = data.profilePicture;

    const reader = await Reader.findByIdAndUpdate(decoded.id, update, { new: true }).select('-password').lean();
    if (!reader) {
      return Response.json({ error: 'Reader not found' }, { status: 404 });
    }

    return Response.json({
      reader: {
        id: reader._id,
        name: reader.name,
        email: reader.email,
        phone: reader.phone || '',
        address: reader.address || '',
        profilePicture: reader.profilePicture || '',
      },
    });
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
