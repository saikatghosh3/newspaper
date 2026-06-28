'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdDisplay from '@/components/AdDisplay';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 12;

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);

  function getEmbedUrl(src) {
    const ytMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return src;
  }

  if (playing) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="aspect-video bg-black">
          <iframe
            src={getEmbedUrl(video.videoUrl)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-slate-900">{video.title}</h3>
          {video.description && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{video.description}</p>
          )}
          <button
            onClick={() => setPlaying(false)}
            className="mt-2 text-xs text-red-600 hover:underline font-medium"
          >
            &larr; Back to thumbnail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group ${
      video.isFeatured ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'
    }`}>
      <button
        onClick={() => setPlaying(true)}
        className="relative aspect-video bg-slate-200 w-full overflow-hidden"
        aria-label={`Play ${video.title}`}
      >
        {video.isFeatured && (
          <div className="absolute top-2 left-2 z-10 px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded shadow">
            ★ Featured
          </div>
        )}
        <img
          src={`https://img.youtube.com/vi/${video.videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] || ''}/hqdefault.jpg`}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-red-600 transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{video.description}</p>
        )}
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/videos?page=${page}&limit=${PAGE_SIZE}`)
      .then(r => r.json())
      .then(data => {
        const all = data.videos || [];
        all.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        setVideos(all);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={categories} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full bg-red-600" />
            <h1 className="text-3xl font-black text-slate-950">Video News</h1>
          </div>
          <p className="text-sm text-slate-500">{total} videos</p>
        </div>

        <AdDisplay position="inline" className="mb-8 flex justify-center" />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">No video news available</p>
            <p className="text-sm mt-1">Check back later for new videos.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map(video => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
            {total > PAGE_SIZE && (
              <div className="flex justify-center mt-10">
                <Pagination page={page} pages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
