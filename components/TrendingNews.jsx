'use client';
import { useState, useEffect, useRef } from 'react';

export default function TrendingNews({ items }) {
  const [titles, setTitles] = useState([]);
  const [speed, setSpeed] = useState(null);
  const tickerRef = useRef(null);

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
    const duration = textWidth / 50;
    setSpeed(duration);
  }, [titles]);

  if (!titles.length) return null;

  const text = titles.map(t => t.title).join('  •  ') + '  •  ';

  return (
    <div className="bg-red-600 text-white py-3 overflow-hidden flex items-center gap-4">
      <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider flex-shrink-0">
        Trending
      </span>
      <div className="overflow-hidden flex-1">
        <div
          ref={tickerRef}
          className="whitespace-nowrap text-sm font-medium inline-block"
          style={speed ? {
            animation: `marquee ${speed}s linear infinite`,
          } : {}}
        >
          <span>{text}</span>
          <span>{text}</span>
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
