'use client';
import { useState, useEffect } from 'react';

export default function AdDisplay({ position = 'sidebar', className = '', max = 1 }) {
  const [ads, setAds] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setAds(null);
    const params = new URLSearchParams({ position });
    fetch(`/api/advertisements?${params}`)
      .then(r => r.json())
      .then(d => {
        if (!cancelled) setAds(d.ads && d.ads.length > 0 ? d.ads.slice(0, max) : []);
      })
      .catch(() => { if (!cancelled) setAds([]); });
    return () => { cancelled = true; };
  }, [position, max]);

  if (ads === null) return null;
  if (ads.length === 0) return null;

  return (
    <div className={className}>
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-center mb-1">Advertisement</div>
      {ads.map(ad => (
        <a
          key={ad._id}
          href={ad.linkUrl || '#'}
          target={ad.linkUrl ? '_blank' : undefined}
          rel={ad.linkUrl ? 'noopener noreferrer' : undefined}
          className="block border border-slate-200 rounded overflow-hidden hover:opacity-95 transition-opacity"
        >
          <img
            src={ad.imageUrl}
            alt={ad.title || 'Advertisement'}
            className="w-full h-auto object-contain"
          />
        </a>
      ))}
    </div>
  );
}
