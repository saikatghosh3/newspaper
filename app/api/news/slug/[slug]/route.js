import connectDB from '@/lib/mongodb';
import News from '@/lib/models/News';
import Review from '@/lib/models/Review';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const news = await News.findOneAndUpdate(
      { slug: params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .lean();
    if (!news) return Response.json({ error: 'Not found' }, { status: 404 });

    const reviews = await Review.find({ news: news._id, status: 'approved' })
      .sort({ createdAt: -1 })
      .lean();

    return new Response(JSON.stringify({ news, reviews }), {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
