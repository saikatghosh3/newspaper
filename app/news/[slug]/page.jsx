import connectDB from '@/lib/mongodb';
import News from '@/lib/models/News';
import Review from '@/lib/models/Review';
import Category from '@/lib/models/Category';
import Settings from '@/lib/models/Settings';
import User from '@/lib/models/User';
import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import AdDisplay from '@/components/AdDisplay';
import Footer from '@/components/Footer';
import NewsDetailClient from './NewsDetailClient';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function NewsDetailPage({ params }) {
  await connectDB();

  const [categories, news, settings] = await Promise.all([
    Category.find({ isActive: true }).sort({ name: 1 }).lean(),
    News.findOneAndUpdate(
      { slug: params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .lean(),
    Settings.findOne().lean().catch(() => null),
  ]);

  if (!news) notFound();

  const reviews = await Review.find({ news: news._id, status: 'approved' })
    .sort({ createdAt: -1 })
    .lean();

  const siteName = settings?.siteName || 'DailyNews';

  return (
    <div className="min-h-screen bg-white">
      <Navbar categories={categories} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="text-red-600 text-sm hover:underline mb-6 inline-block">← Back to Home</Link>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <article>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full mb-4">
                  {news.category?.name}
                </span>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">{news.title}</h1>
                <div className="flex items-center gap-4 text-slate-600 text-sm">
                  <span>{news.author?.name}</span>
                  <span>{formatDate(news.publishedAt)}</span>
                  <span>{news.views} views</span>
                </div>
                <div className="mt-4">
                  <ShareButtons news={JSON.parse(JSON.stringify(news))} />
                </div>
              </div>

              {news.featuredImage && (
                <div className="relative w-full h-56 md:h-96 rounded-lg overflow-hidden mb-8 group">
                  <img src={news.featuredImage} alt={news.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-[2px] rounded px-2 py-1 flex items-center gap-1.5 pointer-events-none select-none">
                    {settings?.logo && (
                      <img src={settings.logo} alt="" className="h-4 w-auto opacity-70" />
                    )}
                    <span className="text-[10px] font-bold text-white/60 tracking-wider uppercase">
                      {siteName}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white text-sm font-medium leading-relaxed drop-shadow-lg">
                      {news.title.split(' ').slice(0, 5).join(' ') + (news.title.split(' ').length > 5 ? '...' : '')}
                    </p>
                  </div>
                </div>
              )}

              {news.newsHighlight && (
                <div
                  className="mb-8 p-5 bg-red-50 border-l-4 border-red-600 rounded-r-lg text-slate-800 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: news.newsHighlight }}
                />
              )}

              <div className="prose prose-sm max-w-none mb-12 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {news.content}
              </div>
            </article>

            <AdDisplay position="inline" className="mb-12 flex justify-center" />

            <NewsDetailClient
              news={JSON.parse(JSON.stringify(news))}
              reviews={JSON.parse(JSON.stringify(reviews))}
            />
          </div>
          <aside className="lg:col-span-3 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              <AdDisplay position="sidebar" />
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
