'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function VideoEmbed({ url, title }) {
  const [playing, setPlaying] = useState(false);

  function getEmbedUrl(src) {
    const ytMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return src;
  }

  if (!playing) {
    return (
      <button
        onClick={() => setPlaying(true)}
        className="relative w-full h-full group cursor-pointer"
        aria-label={`Play ${title}`}
      >
        <img
          src={`https://img.youtube.com/vi/${url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] || ''}/hqdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>
    );
  }

  return (
    <iframe
      src={getEmbedUrl(url)}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
    />
  );
}

export default function VideoNews() {
  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/videos?limit=12')
      .then(r => r.json())
      .then(data => {
        setVideos(data.videos || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (videos.length === 0) return null;

  const sorted = [...videos].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  const active = sorted[activeIndex];

  return (
    <section className="scroll-mt-28 mb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 rounded-full bg-red-600" />
          <h2 className="text-2xl font-black text-slate-950">Video News</h2>
        </div>
        <Link href="/videos" className="text-sm font-bold text-red-600 hover:text-red-700">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {active.isFeatured && (
              <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded shadow">
                ★ Featured
              </div>
            )}
            <VideoEmbed url={active.videoUrl} title={active.title} />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-900">{active.title}</h3>
            {active.description && (
              <p className="text-slate-600 mt-2 text-sm leading-relaxed">{active.description}</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {sorted.map((video, index) => (
              <button
                key={video._id}
                onClick={() => setActiveIndex(index)}
                className={`w-full flex gap-3 text-left p-2 rounded-lg transition-colors ${
                  index === activeIndex
                    ? 'bg-red-50 ring-1 ring-red-200'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-28 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0 relative">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] || ''}/mqdefault.jpg`}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 bg-red-600/90 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {video.isFeatured && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded shadow">
                      ★
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold line-clamp-2 ${
                    index === activeIndex ? 'text-red-700' : 'text-slate-800'
                  }`}>
                    {video.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
