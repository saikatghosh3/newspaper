import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import News from '@/lib/models/News';
import User from '@/lib/models/User';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TrendingNews from '@/components/TrendingNews';
import AdDisplay from '@/components/AdDisplay';
import Footer from '@/components/Footer';
import NewsListClient from './NewsListClient';

export const revalidate = 60;

export async function generateStaticParams() {
  await connectDB();
  const categories = await Category.find({ isActive: true }).select('slug').lean();
  return categories.map(c => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }) {
  await connectDB();

  const [allCategories, trendingNews] = await Promise.all([
    Category.find({ isActive: true }).select('name slug color description').sort({ name: 1 }).lean(),
    News.find({ isTrending: true, status: 'published' })
      .select('title slug')
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const plainCategories = JSON.parse(JSON.stringify(allCategories));
  const plainTrending = JSON.parse(JSON.stringify(trendingNews));

  const currentCategory = plainCategories.find(c => c.slug === params.slug) || null;

  if (!currentCategory) notFound();

  const [total, newsItems] = await Promise.all([
    News.countDocuments({ category: currentCategory._id, status: 'published' }),
    News.find({ category: currentCategory._id, status: 'published' })
      .select('title slug excerpt featuredImage category author publishedAt')
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(9)
      .lean(),
  ]);

  const plainNews = JSON.parse(JSON.stringify(newsItems));

  const pages = Math.ceil(total / 9);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={plainCategories} activeCategorySlug={params.slug} />
      <TrendingNews items={plainTrending} />

      {/* Category Banner */}
      <div className="relative overflow-hidden" style={{ backgroundColor: currentCategory.color || '#dc2626' }}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-white/5 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 py-5 md:py-7 relative z-10">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-white/70 hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{currentCategory.name}</h1>
          {currentCategory.description && (
            <p className="text-white/80 mt-2 max-w-2xl text-sm md:text-base">{currentCategory.description}</p>
          )}
          <div className="flex items-center gap-2 mt-4">
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-sm">{total} articles</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">

            {total === 0 ? (
              <div className="bg-white border border-slate-200 rounded-md p-10 text-center">
                <p className="text-slate-500">No published news found in this category.</p>
              </div>
            ) : (
              <NewsListClient
                categoryId={String(currentCategory._id)}
                initialNews={plainNews}
                currentPage={1}
                totalPages={pages}
              />
            )}
          </div>
          <aside className="lg:col-span-3 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              <AdDisplay position="sidebar" />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
