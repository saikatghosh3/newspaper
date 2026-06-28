'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateVideoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    videoUrl: '',
    thumbnail: '',
    description: '',
    isFeatured: false,
    order: 0,
    status: 'published',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const embedUrl = getYouTubeEmbedUrl(form.videoUrl);
    const res = await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, videoUrl: embedUrl }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to create video');
      setLoading(false);
    } else {
      router.push('/admin/videos');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Add Video News</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Enter video title"
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Video URL (YouTube / Vimeo) *</label>
          <input
            value={form.videoUrl}
            onChange={e => setForm({ ...form, videoUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <p className="text-xs text-slate-400 mt-1">Supports YouTube and Vimeo links</p>
        </div>

        {form.videoUrl && (
          <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
            <iframe
              src={getYouTubeEmbedUrl(form.videoUrl)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video preview"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL (optional)</label>
          <input
            value={form.thumbnail}
            onChange={e => setForm({ ...form, thumbnail: e.target.value })}
            placeholder="https://example.com/thumbnail.jpg"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {form.thumbnail && (
            <img src={form.thumbnail} alt="thumbnail preview" className="mt-2 h-32 w-auto rounded-lg object-cover border border-slate-200" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description of the video"
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
          <input
            type="number"
            value={form.order}
            onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            min="0"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
              className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
            />
            <span className="text-sm text-slate-700 font-medium">Featured Video</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.status === 'published'}
              onChange={e => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })}
              className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
            />
            <span className="text-sm text-slate-700 font-medium">Publish immediately</span>
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Video'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
