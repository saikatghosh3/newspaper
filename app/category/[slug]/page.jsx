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
    Category.find({ isActive: true }).sort({ name: 1 }).lean(),
    News.find({ isTrending: true, status: 'published' })
      .select('title slug')
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const currentCategory = allCategories.find(c => c.slug === params.slug) || null;

  if (!currentCategory) notFound();

  const [total, newsItems] = await Promise.all([
    News.countDocuments({ category: currentCategory._id, status: 'published' }),
    News.find({ category: currentCategory._id, status: 'published' })
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(9)
      .lean(),
  ]);

  const pages = Math.ceil(total / 9);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={allCategories} activeCategorySlug={params.slug} />
      <TrendingNews items={trendingNews} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex text-sm font-bold text-red-600 hover:text-red-700 mb-6">
          Back to Home
        </Link>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <div className="bg-white border border-slate-200 rounded-md p-6 lg:p-8 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-1.5 h-9 rounded-full" style={{ backgroundColor: currentCategory.color || '#dc2626' }} />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-950">{currentCategory.name}</h1>
              {currentCategory.description && (
                <p className="text-slate-600 mt-3 max-w-2xl">{currentCategory.description}</p>
              )}
            </div>

            {total === 0 ? (
              <div className="bg-white border border-slate-200 rounded-md p-10 text-center">
                <p className="text-slate-500">No published news found in this category.</p>
              </div>
            ) : (
              <NewsListClient
                categoryId={String(currentCategory._id)}
                initialNews={JSON.parse(JSON.stringify(newsItems))}
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
