'use client';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Img from '@/components/Img';

export default function NewsCard({ news, compact, horizontal }) {
  if (horizontal) {
    return (
      <Link href={`/news/${news.slug}`}>
        <div className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group hover:border-slate-300">
          <Img src={news.featuredImage} alt={news.title} loading="lazy" className="w-28 h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider w-fit mb-2">
              {news.category?.name}
            </span>
            <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">{news.title}</h3>
            {news.excerpt && (
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">{news.excerpt}</p>
            )}
            <p className="text-xs text-slate-400 mt-2">{formatDate(news.publishedAt)}</p>
          </div>
        </div>
      </Link>
    );
  }

  if (compact) {
    return (
      <Link href={`/news/${news.slug}`}>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
          <Img src={news.featuredImage} alt={news.title} loading="lazy" className="w-full h-32 object-cover group-hover:scale-110 transition-transform" />
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
          <Img src={news.featuredImage} alt={news.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
