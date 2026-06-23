import connectDB from '@/lib/mongodb';
import News from '@/lib/models/News';

export async function GET() {
  try {
    await connectDB();
    const news = await News.find({ status: 'published' })
      .select('title slug')
      .sort({ title: 1 })
      .lean();
    return new Response(JSON.stringify({ news }), {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=120, stale-while-revalidate=300' },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
