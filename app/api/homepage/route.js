import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import Category from '@/lib/models/Category';
import News from '@/lib/models/News';
import User from '@/lib/models/User';

export const revalidate = 60;

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '7'), 20);

    const [settings, categories, trendingNews, featuredNews] = await Promise.all([
      Settings.findOne().lean().catch(() => null),
      Category.find({ isActive: true }).sort({ name: 1 }).lean(),
      News.find({ isTrending: true, status: 'published' })
        .populate('category', 'name slug color')
        .populate('author', 'name')
        .sort({ publishedAt: -1 })
        .limit(20)
        .lean(),
      News.find({ status: 'published' })
        .populate('category', 'name slug color')
        .populate('author', 'name')
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(1)
        .lean(),
    ]);

    const categoryIds = categories.map(c => c._id);
    const categoryNews = categoryIds.length > 0
      ? await News.find({ category: { $in: categoryIds }, status: 'published' })
          .populate('category', 'name slug color')
          .populate('author', 'name')
          .sort({ publishedAt: -1, createdAt: -1 })
          .limit(categoryIds.length * limit)
          .lean()
      : [];

    const newsByCategory = {};
    categories.forEach(cat => {
      newsByCategory[cat._id] = [];
    });
    categoryNews.forEach(item => {
      const catId = String(item.category?._id || item.category);
      if (newsByCategory[catId] && newsByCategory[catId].length < limit) {
        newsByCategory[catId].push(item);
      }
    });

    const featured = featuredNews[0] || categoryNews[0] || null;

    return new Response(JSON.stringify({
      settings: settings || {},
      categories,
      newsByCategory,
      featured,
      trending: trendingNews,
    }), {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
