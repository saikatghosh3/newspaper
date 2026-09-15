import connectDB from '@/lib/mongodb';
import News from '@/lib/models/News';
import Review from '@/lib/models/Review';
import Category from '@/lib/models/Category';
import Settings from '@/lib/models/Settings';
import User from '@/lib/models/User';
import Navbar from '@/components/Navbar';
import AdDisplay from '@/components/AdDisplay';
import Footer from '@/components/Footer';
import NewsDetailClient from './NewsDetailClient';
import NewsActions from '@/components/NewsActions';
import ViewTracker from '@/components/ViewTracker';
import Img from '@/components/Img';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  await connectDB();
  const news = await News.find({ status: 'published' })
    .select('slug')
    .sort({ publishedAt: -1 })
    .limit(50)
    .lean();
  return news.map(n => ({ slug: n.slug }));
}

export default async function NewsDetailPage({ params }) {
  await connectDB();

  const news = await News.findOne({ slug: params.slug, status: 'published' })
    .select('title slug content excerpt featuredImage category author isTrending tags newsHighlight views publishedAt')
    .populate('category', 'name slug color')
    .populate('author', 'name')
    .lean();

  if (!news) notFound();

  const newsId = news._id;
  const categoryId = news.category?._id;

  const [categories, settings, reviews, suggestions] = await Promise.all([
    Category.find({ isActive: true }).select('name slug color').sort({ name: 1 }).lean(),
    Settings.findOne().select('siteName logo').lean().catch(() => null),
    Review.find({ news: newsId, status: 'approved' })
      .select('name content rating createdAt')
      .sort({ createdAt: -1 })
      .lean(),
    News.find({
      _id: { $ne: newsId },
      status: 'published',
      ...(categoryId ? { category: categoryId } : {}),
    })
      .select('title slug excerpt featuredImage category author publishedAt')
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .limit(6)
      .lean(),
  ]);

  const plainCategories = JSON.parse(JSON.stringify(categories));
  const plainNews = JSON.parse(JSON.stringify(news));
  const plainReviews = JSON.parse(JSON.stringify(reviews));
  const plainSuggestions = JSON.parse(JSON.stringify(suggestions));

  const siteName = settings?.siteName || 'DailyNews';

  return (
    <div className="min-h-screen bg-white">
      <Navbar categories={plainCategories} />
      <ViewTracker slug={params.slug} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 no-print">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {plainNews.category?.name && (
            <>
              <Link href={`/category/${plainNews.category.slug}`} className="hover:text-red-600 transition-colors">
                {plainNews.category.name}
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
          <span className="text-slate-800 font-medium truncate max-w-[200px]">{plainNews.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <article>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {plainNews.category?.name}
                  </span>
                  {plainNews.isTrending && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>
                      Trending
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">{plainNews.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm mb-4">
                  {plainNews.author?.name && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-600">{plainNews.author.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-slate-700">{plainNews.author.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(plainNews.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{plainNews.views?.toLocaleString() || 0} views</span>
                  </div>
                </div>

                <NewsActions news={plainNews} />
              </div>

              {plainNews.featuredImage && (
                <div className="relative w-full h-56 md:h-96 rounded-2xl overflow-hidden mb-8">
                  <Img src={plainNews.featuredImage} alt={plainNews.title} loading="eager" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 pointer-events-none select-none">
                    {settings?.logo && (
                      <img src={settings.logo} alt="" className="h-5 w-5 rounded-full object-cover opacity-80" />
                    )}
                    <span className="text-[10px] font-bold text-white/70 tracking-wider uppercase">
                      {siteName}
                    </span>
                  </div>
                </div>
              )}

              {plainNews.newsHighlight && (
                <div
                  className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-600 rounded-r-xl text-slate-800 text-lg leading-relaxed font-medium"
                  dangerouslySetInnerHTML={{ __html: plainNews.newsHighlight }}
                />
              )}

              <div className="prose prose-sm max-w-none mb-12 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {plainNews.content}
              </div>

              {plainNews.tags && plainNews.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-8 no-print">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {plainNews.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>

            <AdDisplay position="inline" className="mb-12 flex justify-center no-print" />

            {plainSuggestions.length > 0 && (
              <section className="mb-12 no-print related-news">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6">
                  <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-500 to-blue-700" />
                  <h2 className="text-2xl font-black text-slate-950">You Might Also Like</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {plainSuggestions.map((item) => (
                    <Link key={item._id} href={`/news/${item.slug}`} className="group">
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                        <div className="relative aspect-video bg-slate-100 overflow-hidden">
                          {item.featuredImage ? (
                            <Img
                              src={item.featuredImage}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                          <span
                            className="absolute bottom-2 left-3 px-2.5 py-1 text-[10px] font-bold text-white rounded-md shadow-sm"
                            style={{ backgroundColor: item.category?.color || '#dc2626' }}
                          >
                            {item.category?.name}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col p-4">
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                            {item.title}
                          </h3>
                          {item.excerpt && (
                            <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">{item.excerpt}</p>
                          )}
                          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <span>{item.author?.name || 'Unknown'}</span>
                            <span>{formatDate(item.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <NewsDetailClient
              news={plainNews}
              reviews={plainReviews}
            />
          </div>

          <aside className="lg:col-span-3 mt-12 lg:mt-0 no-print">
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
