'use client';
import { useState, useEffect, useRef } from 'react';

export default function NewsTicker() {
  const [titles, setTitles] = useState([]);
  const [position, setPosition] = useState(0);
  const tickerRef = useRef(null);

  useEffect(() => {
    fetch('/api/news?status=published&limit=20&admin=1')
      .then(r => r.json())
      .then(d => {
        if (d.news) setTitles(d.news.map(n => n.title));
      });
  }, []);

  useEffect(() => {
    if (!titles.length) return;
    const interval = setInterval(() => {
      setPosition(p => p + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [titles]);

  useEffect(() => {
    if (!tickerRef.current) return;
    const width = tickerRef.current.scrollWidth / 2;
    if (position >= width) setPosition(0);
  }, [position]);

  if (!titles.length) return null;

  const text = titles.join('  •  ') + '  •  ' + titles.join('  •  ');

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden flex items-center">
      <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider mr-3 flex-shrink-0">
        Breaking
      </span>
      <div className="overflow-hidden flex-1">
        <div
          ref={tickerRef}
          className="whitespace-nowrap text-sm font-medium"
          style={{ transform: `translateX(-${position}px)` }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
