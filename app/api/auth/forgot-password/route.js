import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import PasswordReset from '@/lib/models/PasswordReset';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email || !email.trim()) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase(), role: 'reporter' }).lean();
    if (!user) {
      return Response.json({ error: 'No reporter found with this email' }, { status: 404 });
    }

    const existing = await PasswordReset.findOne({
      email: email.trim().toLowerCase(),
      status: 'pending',
    }).lean();

    if (existing) {
      return Response.json({ message: 'A password reset request is already pending for this email. The superadmin will review it shortly.' });
    }

    await PasswordReset.create({
      email: email.trim().toLowerCase(),
      reporterId: user._id,
      reporterName: user.name,
    });

    return Response.json({ message: 'Password reset request sent to superadmin.' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const requests = await PasswordReset.find().sort({ createdAt: -1 }).lean();
    return Response.json({ requests });
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
    const { requestId, action, newPassword } = await req.json();

    if (!requestId || !action) {
      return Response.json({ error: 'requestId and action are required' }, { status: 400 });
    }

    const resetRequest = await PasswordReset.findById(requestId);
    if (!resetRequest) {
      return Response.json({ error: 'Request not found' }, { status: 404 });
    }
    if (resetRequest.status !== 'pending') {
      return Response.json({ error: 'Request already resolved' }, { status: 400 });
    }

    if (action === 'reset') {
      if (!newPassword || newPassword.length < 6) {
        return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      }

      const user = await User.findById(resetRequest.reporterId);
      if (!user) {
        return Response.json({ error: 'Reporter not found' }, { status: 404 });
      }

      user.password = newPassword;
      user.isActive = true;
      await user.save();

      resetRequest.status = 'resolved';
      resetRequest.resolvedAt = new Date();
      resetRequest.resolvedBy = decoded.name || decoded.email;
      resetRequest.newPassword = newPassword;
      await resetRequest.save();

      return Response.json({ message: 'Password reset successfully. The reporter can now log in with the new password.' });
    }

    if (action === 'block') {
      const user = await User.findById(resetRequest.reporterId);
      if (user) {
        user.isActive = false;
        await user.save();
      }

      resetRequest.status = 'blocked';
      resetRequest.resolvedAt = new Date();
      resetRequest.resolvedBy = decoded.name || decoded.email;
      await resetRequest.save();

      return Response.json({ message: 'Reporter has been blocked.' });
    }

    return Response.json({ error: 'Invalid action. Use "reset" or "block".' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
