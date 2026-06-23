'use client';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import ShareButtons from '@/components/ShareButtons';

export default function NewsCard({ news, compact, horizontal }) {
  if (horizontal) {
    return (
      <Link href={`/news/${news.slug}`}>
        <div className="flex gap-4 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-lg transition-shadow group">
          {news.featuredImage && (
            <img src={news.featuredImage} alt={news.title} className="w-24 h-24 object-cover rounded group-hover:scale-105 transition-transform" />
          )}
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded mb-1">
              {news.category?.name}
            </span>
            <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-red-600 transition-colors">{news.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{formatDate(news.publishedAt)}</p>
          </div>
        </div>
      </Link>
    );
  }

  if (compact) {
    return (
      <Link href={`/news/${news.slug}`}>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
          {news.featuredImage && (
            <img src={news.featuredImage} alt={news.title} className="w-full h-32 object-cover group-hover:scale-110 transition-transform" />
          )}
          <div className="p-3">
            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded mb-2">
              {news.category?.name}
            </span>
            <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-red-600 transition-colors">{news.title}</h3>
            <p className="text-xs text-slate-400 mt-2">{formatDate(news.publishedAt)}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${news.slug}`} className="block h-full group">
      <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-video bg-slate-100 overflow-hidden">
          {news.featuredImage ? (
            <img src={news.featuredImage} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          <span
            className="absolute bottom-2 left-3 px-2.5 py-1 text-xs font-bold text-white rounded-md shadow-sm"
            style={{ backgroundColor: news.category?.color || '#dc2626' }}
          >
            {news.category?.name}
          </span>
        </div>
        <div className="flex-1 flex flex-col p-4">
          <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
            {news.title}
          </h3>
          {news.excerpt && (
            <p className="text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed">{news.excerpt}</p>
          )}
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-[9px] font-bold text-red-600">
                  {news.author?.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <span className="truncate max-w-[100px]">{news.author?.name || 'Unknown'}</span>
            </div>
            <span>{formatDate(news.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
