'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function CreateNewsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    featuredImageType: 'url',
    category: '',
    status: 'draft',
    isTrending: false,
    isFeatured: false,
    tags: '',
    newsHighlight: '',
  });
  const [error, setError] = useState('');

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, featuredImage: reader.result, featuredImageType: 'upload' });
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  const permissions = user?.permissions || {};
  const isSuperadmin = user?.role === 'superadmin';
  const canPublish = isSuperadmin || permissions.canPublishNews;
  const canTrend = isSuperadmin || permissions.canTrendNews;
  const canFeature = isSuperadmin || permissions.canFeatureNews;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (!canPublish) payload.status = 'draft';
      if (!canTrend) payload.isTrending = false;
      if (!canFeature) payload.isFeatured = false;
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create news');
        return;
      }
      router.push('/admin/news');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Create News</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Article Details</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter news title..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Short description..."
            />
          </div>
          <div>
            <RichTextEditor
              label="News Highlight"
              value={form.newsHighlight}
              onChange={(html) => setForm({ ...form, newsHighlight: html })}
              placeholder="Enter highlight text with rich formatting..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content *</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={12}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 resize-y font-mono text-sm"
              placeholder="Write your news content here..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Featured Image</label>
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="imageSource"
                  checked={form.featuredImageType === 'url'}
                  onChange={() => setForm({ ...form, featuredImageType: 'url', featuredImage: '' })}
                  className="h-4 w-4 text-red-600"
                />
                Image URL
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="imageSource"
                  checked={form.featuredImageType === 'upload'}
                  onChange={() => setForm({ ...form, featuredImageType: 'upload', featuredImage: '' })}
                  className="h-4 w-4 text-red-600"
                />
                Upload File
              </label>
            </div>
            {form.featuredImageType === 'url' ? (
              <input
                value={form.featuredImage}
                onChange={e => setForm({ ...form, featuredImage: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://..."
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-slate-700"
              />
            )}
            {form.featuredImage && (
              <img src={form.featuredImage} alt="preview" className="mt-2 h-auto max-h-32 w-full rounded-lg object-contain" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                disabled={!canPublish}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
              <input
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="politics, economy, sports"
              />
            </div>
          </div>
          <div className="flex gap-6">
            {canTrend && <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isTrending}
                onChange={e => setForm({ ...form, isTrending: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
              <span className="text-sm text-slate-700">Mark as Trending</span>
            </label>}
            {canFeature && <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
              <span className="text-sm text-slate-700">Mark as Featured</span>
            </label>}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Saving...' : canPublish ? 'Publish News' : 'Submit Draft'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
