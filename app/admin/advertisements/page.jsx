'use client';
import { useState, useEffect, useCallback } from 'react';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 12;

export default function AdvertisementsPage() {
  const [ads, setAds] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    imageUrl: '', linkUrl: '', position: 'sidebar',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAds = useCallback(async () => {
    const res = await fetch(`/api/advertisements?admin=1&page=${page}&limit=${PAGE_SIZE}`);
    const data = await res.json();
    setAds(data.ads || []);
    setTotal(data.total || 0);
  }, [page]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, imageUrl: reader.result });
      setError('');
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const res = await fetch('/api/advertisements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, isActive: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to create advertisement');
    } else {
      setForm({ imageUrl: '', linkUrl: '', position: 'sidebar' });
      setShowForm(false);
      fetchAds();
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this advertisement?')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/advertisements/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAds();
  }

  async function toggleActive(id, current) {
    const token = localStorage.getItem('token');
    await fetch(`/api/advertisements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchAds();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Advertisements</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + New Ad
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image *</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  required={!form.imageUrl}
                />
              </div>
              {form.imageUrl && (
                <img src={form.imageUrl} alt="ad preview" className="mt-2 h-32 w-auto rounded-lg object-cover border border-slate-200" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link URL (optional)</label>
              <input
                value={form.linkUrl}
                onChange={e => setForm({ ...form, linkUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
              <select
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="sidebar">Sidebar</option>
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="inline">Inline</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg disabled:opacity-60"
              >
                {loading ? 'Creating...' : 'Create Ad'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(''); }}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {total === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-white rounded-lg shadow-sm border border-slate-200">
          No advertisements yet. Click "New Ad" to add one.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ads.map(ad => (
              <div key={ad._id} className="bg-white rounded-lg shadow-sm p-4 overflow-hidden">
                <div className="flex gap-4">
                  <a href={ad.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <img src={ad.imageUrl} alt="Advertisement" className="w-32 h-24 object-cover rounded border border-slate-200" />
                  </a>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">
                      <span className="font-medium">Position:</span> {ad.position}
                    </p>
                    {ad.linkUrl && (
                      <p className="text-xs text-slate-400 truncate mt-1">
                        <span className="font-medium">Link:</span> {ad.linkUrl}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      <span className="font-medium">Clicks:</span> {ad.clicks || 0}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => toggleActive(ad._id, ad.isActive)}
                        className={`px-3 py-1.5 text-xs rounded font-medium ${
                          ad.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="px-3 py-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {total > PAGE_SIZE && (
            <div className="flex justify-center mt-6">
              <Pagination page={page} pages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
