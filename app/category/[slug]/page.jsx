import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import News from '@/lib/models/News';
import User from '@/lib/models/User';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TrendingNews from '@/components/TrendingNews';
import NewsCard from '@/components/NewsCard';
import AdDisplay from '@/components/AdDisplay';
import Footer from '@/components/Footer';

export const revalidate = 60;

const PAGE_SIZE = 9;

export default async function CategoryPage({ params, searchParams }) {
  const page = Math.max(1, parseInt(searchParams?.page) || 1);

  await connectDB();

  const [categories, currentCategory, trendingNews] = await Promise.all([
    Category.find({ isActive: true }).sort({ name: 1 }).lean(),
    Category.findOne({ slug: params.slug, isActive: true }).lean(),
    News.find({ isTrending: true, status: 'published' })
      .select('title slug')
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean(),
  ]);

  if (!currentCategory) {
    notFound();
  }

  const [total, newsItems] = await Promise.all([
    News.countDocuments({ category: currentCategory._id, status: 'published' }),
    News.find({ category: currentCategory._id, status: 'published' })
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
  ]);

  const pages = Math.ceil(total / PAGE_SIZE);

  function renderPagination(currentPage, totalPages, slug) {
    const maxVisible = 5;
    const items = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (currentPage > 1) {
      items.push(
        <Link key="prev" href={`/category/${slug}?page=${currentPage - 1}`}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
          Prev
        </Link>
      );
    }

    if (start > 1) {
      items.push(
        <Link key={1} href={`/category/${slug}?page=1`}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">1</Link>
      );
      if (start > 2) {
        items.push(<span key="dots1" className="px-1 text-slate-400 text-sm">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <Link key={i} href={`/category/${slug}?page=${i}`}
          className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
            i === currentPage
              ? 'bg-red-600 text-white border-red-600 pointer-events-none'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}>
          {i}
        </Link>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        items.push(<span key="dots2" className="px-1 text-slate-400 text-sm">...</span>);
      }
      items.push(
        <Link key={totalPages} href={`/category/${slug}?page=${totalPages}`}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">{totalPages}</Link>
      );
    }

    if (currentPage < totalPages) {
      items.push(
        <Link key="next" href={`/category/${slug}?page=${currentPage + 1}`}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
          Next
        </Link>
      );
    }

    return items;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={categories} activeCategorySlug={params.slug} />
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

            {newsItems.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-md p-10 text-center">
                <p className="text-slate-500">No published news found in this category.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newsItems.map(item => (
                    <NewsCard key={item._id} news={item} />
                  ))}
                </div>

                {pages > 1 && (
                  <div className="flex justify-center mt-10">
                    <div className="flex items-center gap-2">
                      {renderPagination(page, pages, params.slug)}
                    </div>
                  </div>
                )}
              </>
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
