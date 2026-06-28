import connectDB from '@/lib/mongodb';
import News from '@/lib/models/News';
import Category from '@/lib/models/Category';
import User from '@/lib/models/User';
import VideoNews from '@/lib/models/VideoNews';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

const PIE_COLORS = ['#dc2626', '#2563eb', '#16a34a', '#ca8a04', '#9333ea', '#ea580c', '#0891b2', '#be185d', '#4f46e5', '#65a30d', '#0d9488', '#7c3aed', '#b45309', '#e11d48', '#0284c7'];

export async function GET(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalNews,
      totalCategories,
      totalReporters,
      totalVideos,
      viewsResult,
      newsPerCategory,
      topViewed,
      newsOverTime,
      newsByAuthor,
      videoOverTime,
    ] = await Promise.all([
      News.countDocuments({ status: 'published' }),
      Category.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'reporter' }),
      VideoNews.countDocuments({ status: 'published' }),
      News.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: null, total: { $sum: '$views' } } },
      ]),
      News.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        { $project: { name: '$category.name', count: 1 } },
        { $sort: { count: -1 } },
      ]),
      News.find({ status: 'published' })
        .sort({ views: -1 })
        .limit(50)
        .populate('category', 'name')
        .select('title slug views category publishedAt')
        .lean(),
      News.aggregate([
        { $match: { status: 'published', publishedAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      News.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$author', count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { name: '$user.name', role: '$user.role', count: 1 } },
        { $sort: { count: -1 } },
      ]),
      VideoNews.aggregate([
        { $match: { status: 'published', createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const totalViews = viewsResult.length > 0 ? viewsResult[0].total : 0;

    const pieData = newsPerCategory.map((item, i) => ({
      name: item.name || 'Uncategorized',
      value: item.count,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));

    const barData = newsOverTime.map(item => ({
      date: item._id,
      count: item.count,
    }));

    const viewData = topViewed.map(item => ({
      title: item.title,
      slug: item.slug,
      views: item.views,
      category: item.category?.name || 'Uncategorized',
    }));

    const authorData = newsByAuthor.map(item => ({
      name: item.name || 'Unknown',
      role: item.role || 'Unknown',
      count: item.count,
    }));

    const videoBarData = videoOverTime.map(item => ({
      date: item._id,
      count: item.count,
    }));

    return Response.json({
      totalNews,
      totalCategories,
      totalReporters,
      totalVideos,
      totalViews,
      pieData,
      barData,
      viewData,
      authorData,
      videoBarData,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
