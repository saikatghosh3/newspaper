'use client';
import { useState } from 'react';
import NewsCard from '@/components/NewsCard';

export default function NewsListClient({ categoryId, initialNews, currentPage: initialPage, totalPages }) {
  const [news, setNews] = useState(initialNews);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  async function goToPage(newPage) {
    if (loading || newPage < 1 || newPage > totalPages) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: categoryId,
        status: 'published',
        limit: '9',
        page: String(newPage),
      });
      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();
      if (data.news) {
        setNews(data.news);
        setPage(newPage);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function renderPagination() {
    const maxVisible = 5;
    const items = [];
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (page > 1) {
      items.push(
        <button key="prev" onClick={() => goToPage(page - 1)} disabled={loading}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-sm font-medium">
          Prev
        </button>
      );
    }

    if (start > 1) {
      items.push(
        <button key={1} onClick={() => goToPage(1)} disabled={loading}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">1</button>
      );
      if (start > 2) {
        items.push(<span key="dots1" className="px-1 text-slate-400 text-sm">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <button key={i} onClick={() => goToPage(i)} disabled={loading}
          className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
            i === page
              ? 'bg-red-600 text-white border-red-600'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}>
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        items.push(<span key="dots2" className="px-1 text-slate-400 text-sm">...</span>);
      }
      items.push(
        <button key={totalPages} onClick={() => goToPage(totalPages)} disabled={loading}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">{totalPages}</button>
      );
    }

    if (page < totalPages) {
      items.push(
        <button key="next" onClick={() => goToPage(page + 1)} disabled={loading}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-sm font-medium">
          Next
        </button>
      );
    }

    return items;
  }

  return (
    <>
      {loading && (
        <div className="text-center py-4 mb-4">
          <span className="text-sm text-slate-500">Loading...</span>
        </div>
      )}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        {news.map(item => (
          <NewsCard key={item._id} news={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-2">
            {renderPagination()}
          </div>
        </div>
      )}
    </>
  );
}
