'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

function getYoutubeId(src) {
  const match = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match?.[1] || '';
}

function getEmbedUrl(src) {
  const ytMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  return src;
}

export default function VideoNews() {
  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetch('/api/videos?limit=12')
      .then(r => r.json())
      .then(data => {
        setVideos(data.videos || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scroll = useCallback((dir) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir === 'next' ? 340 : -340, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-5">
          <span className="w-1.5 h-8 rounded-full bg-red-600" />
          <h2 className="text-2xl font-black text-slate-950">Video News</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="shrink-0 w-[320px] h-[200px] bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (videos.length === 0) return null;

  const sorted = [...videos].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-5">
        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-red-500 to-red-700" />
        <h2 className="text-2xl font-black text-slate-950">Video News</h2>
        <div className="hidden sm:flex items-center gap-1 ml-2 px-2.5 py-1 bg-red-100 rounded-full">
          <svg className="w-3.5 h-3.5 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span className="text-xs font-bold text-red-600">{videos.length}</span>
        </div>
        <Link href="/videos" className="ml-auto text-sm font-bold text-red-600 hover:text-red-700">
          See all
        </Link>
      </div>

      {/* Slider with arrows on sides */}
      <div className="relative group/slider">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('prev')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity -ml-3"
          aria-label="Previous"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('next')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity -mr-3"
          aria-label="Next"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Cards */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sorted.map((video, index) => {
            const ytId = getYoutubeId(video.videoUrl);
            const isPlaying = activeIndex === index && playing;

            return (
              <div key={video._id} className="shrink-0 w-[320px]">
                <div className="relative rounded-xl overflow-hidden bg-slate-900 shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                  <div className="relative aspect-video">
                    {isPlaying ? (
                      <iframe
                        src={getEmbedUrl(video.videoUrl)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                      />
                    ) : (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                          alt={video.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                        <button
                          onClick={() => { setActiveIndex(index); setPlaying(true); }}
                          className="absolute inset-0 flex items-center justify-center"
                          aria-label={`Play ${video.title}`}
                        >
                          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        </button>
                      </>
                    )}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      {video.isFeatured && (
                        <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded shadow">★ Featured</span>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    {video.category?.name && (
                      <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">{video.category.name}</span>
                    )}
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors mt-1">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">{video.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
