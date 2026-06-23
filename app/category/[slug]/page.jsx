'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TrendingNews from '@/components/TrendingNews';
import NewsCard from '@/components/NewsCard';
import AdDisplay from '@/components/AdDisplay';
import { CategorySkeleton } from '@/components/Skeleton';
import Footer from '@/components/Footer';

const PAGE_SIZE = 9;

export default function CategoryPage({ params }) {
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    setNews([]);

    let cancelled = false;

    fetch('/api/categories')
      .then(r => r.json())
      .then(async categoryData => {
        if (cancelled) return;
        const nextCategories = categoryData.categories || [];
        const nextCategory = nextCategories.find(item => item.slug === params.slug) || null;

        setCategories(nextCategories);
        setCategory(nextCategory);

        if (!nextCategory) {
          setPages(1);
          return;
        }

        const newsParams = new URLSearchParams({
          category: nextCategory._id,
          status: 'published',
          limit: String(PAGE_SIZE),
          page: '1',
        });
        const newsData = await fetch(`/api/news?${newsParams}`).then(r => r.json());

        if (cancelled) return;
        setNews(newsData.news || []);
        setPages(newsData.pages || 1);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [params.slug]);

  async function goToPage(newPage) {
    if (!category || pageLoading || newPage < 1 || newPage > pages) return;

    setPageLoading(true);
    const newsParams = new URLSearchParams({
      category: category._id,
      status: 'published',
      limit: String(PAGE_SIZE),
      page: String(newPage),
    });
    const newsData = await fetch(`/api/news?${newsParams}`).then(r => r.json());
    setNews(newsData.news || []);
    setPage(newPage);
    setPages(newsData.pages || pages);
    setPageLoading(false);
  }

  function renderPagination() {
    const maxVisible = 5;
    const items = [];
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (page > 1) {
      items.push(
        <button key="prev" onClick={() => goToPage(page - 1)} disabled={pageLoading}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-sm font-medium">
          Prev
        </button>
      );
    }

    if (start > 1) {
      items.push(
        <button key={1} onClick={() => goToPage(1)} disabled={pageLoading}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">1</button>
      );
      if (start > 2) {
        items.push(<span key="dots1" className="px-1 text-slate-400 text-sm">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <button key={i} onClick={() => goToPage(i)} disabled={pageLoading}
          className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
            i === page
              ? 'bg-red-600 text-white border-red-600'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}>
          {i}
        </button>
      );
    }

    if (end < pages) {
      if (end < pages - 1) {
        items.push(<span key="dots2" className="px-1 text-slate-400 text-sm">...</span>);
      }
      items.push(
        <button key={pages} onClick={() => goToPage(pages)} disabled={pageLoading}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">{pages}</button>
      );
    }

    if (page < pages) {
      items.push(
        <button key="next" onClick={() => goToPage(page + 1)} disabled={pageLoading}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-sm font-medium">
          Next
        </button>
      );
    }

    return items;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={categories} activeCategorySlug={params.slug} />
      <TrendingNews />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex text-sm font-bold text-red-600 hover:text-red-700 mb-6">
          Back to Home
        </Link>

        {loading && <CategorySkeleton />}

        {!loading && !category && (
          <div className="bg-white border border-slate-200 rounded-md p-10 text-center">
            <h1 className="text-2xl font-black text-slate-950">Category not found</h1>
            <p className="text-slate-500 mt-2">This category does not exist.</p>
          </div>
        )}

        {!loading && category && (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-9">
              <div className="bg-white border border-slate-200 rounded-md p-6 lg:p-8 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-1.5 h-9 rounded-full" style={{ backgroundColor: category.color || '#dc2626' }} />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-950">{category.name}</h1>
                {category.description && (
                  <p className="text-slate-600 mt-3 max-w-2xl">{category.description}</p>
                )}
              </div>

              {news.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-md p-10 text-center">
                  <p className="text-slate-500">No published news found in this category.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map(item => (
                      <NewsCard key={item._id} news={item} />
                    ))}
                  </div>

                  {pages > 1 && (
                    <div className="flex justify-center mt-10">
                      <div className="flex items-center gap-2">
                        {renderPagination()}
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
        )}
      </main>

      <Footer />
    </div>
  );
}
