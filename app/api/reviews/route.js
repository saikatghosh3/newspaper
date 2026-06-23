import connectDB from '@/lib/mongodb';
import Review from '@/lib/models/Review';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const newsId = searchParams.get('newsId');
    const status = searchParams.get('status');
    const admin = searchParams.get('admin');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));

    const query = {};
    if (newsId) query.news = newsId;
    if (admin) {
      if (status) query.status = status;
    } else {
      query.status = 'approved';
      if (newsId) query.news = newsId;
    }

    const [total, reviews] = await Promise.all([
      Review.countDocuments(query),
      Review.find(query)
        .populate('reader', 'name profilePicture')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return Response.json({ reviews, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const review = new Review({ ...data, status: 'pending' });
    await review.save();
    return Response.json({ review, message: 'Review submitted and pending approval' }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
