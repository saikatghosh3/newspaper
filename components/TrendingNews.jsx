'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function TrendingNews({ items }) {
  const [titles, setTitles] = useState([]);
  const [speed, setSpeed] = useState(null);
  const tickerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items && items.length) {
      setTitles(items.map(n => ({ title: n.title, slug: n.slug })));
      return;
    }
    let cancelled = false;
    const params = new URLSearchParams({ trending: 'true', limit: '20', status: 'published' });
    fetch(`/api/news?${params}`)
      .then(r => r.json())
      .then(d => {
        if (!cancelled && d.news) setTitles(d.news.map(n => ({ title: n.title, slug: n.slug })));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [items]);

  useEffect(() => {
    if (!titles.length || !tickerRef.current) return;
    const textWidth = tickerRef.current.scrollWidth / 2;
    const duration = textWidth / 60;
    setSpeed(duration);
  }, [titles]);

  if (!titles.length) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 py-3">
          {/* Live Badge */}
          <div className="flex items-center gap-2 shrink-0 bg-red-600 px-4 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-white text-xs font-bold uppercase tracking-wider">Trending</span>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-slate-600 shrink-0"></div>

          {/* Scrolling Ticker */}
          <div
            className="overflow-hidden flex-1 cursor-pointer"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              ref={tickerRef}
              className="whitespace-nowrap text-sm font-medium inline-block"
              style={speed ? {
                animation: `marquee ${speed}s linear infinite`,
                animationPlayState: isPaused ? 'paused' : 'running',
              } : {}}
            >
              {[...titles, ...titles].map((item, idx) => (
                <span key={idx} className="inline-flex items-center">
                  <Link
                    href={`/news/${item.slug}`}
                    className="text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                  <span className="mx-4 text-red-500 text-xs">
                    <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="4" />
                    </svg>
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <div className="shrink-0 hidden md:flex items-center gap-1 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
