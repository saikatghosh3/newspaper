'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 12;

export default function AdminVideosPage() {
  const [videos, setVideos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/videos?admin=1&page=${page}&limit=${PAGE_SIZE}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setVideos(data.videos || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  async function handleDelete(id) {
    if (!confirm('Delete this video?')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/videos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchVideos();
  }

  async function toggleStatus(id, current) {
    const token = localStorage.getItem('token');
    await fetch(`/api/videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: current === 'published' ? 'draft' : 'published' }),
    });
    fetchVideos();
  }

  async function toggleFeatured(id, current) {
    const token = localStorage.getItem('token');
    await fetch(`/api/videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isFeatured: !current }),
    });
    fetchVideos();
  }

  const isSuperadmin = user?.role === 'superadmin';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Video News</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total videos</p>
        </div>
        {(isSuperadmin || user?.permissions?.canUploadVideos) && (
          <Link
            href="/admin/videos/create"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Add Video
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
          </div>
        ) : total === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No video news yet.{' '}
            {(isSuperadmin || user?.permissions?.canUploadVideos) && (
              <Link href="/admin/videos/create" className="text-red-600 hover:underline">
                Add your first video
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Video</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Featured</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {videos.map(v => (
                  <tr key={v._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-12 bg-slate-200 rounded overflow-hidden flex-shrink-0 relative">
                          {v.thumbnail ? (
                            <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 line-clamp-1">{v.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{new Date(v.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(v._id, v.status)}
                        className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                          v.status === 'published'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {v.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(v._id, v.isFeatured)}
                        className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                          v.isFeatured
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {v.isFeatured ? '★ Featured' : '☆ Set Featured'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isSuperadmin || user?.permissions?.canEditVideos ? (
                          <Link
                            href={`/admin/videos/edit/${v._id}`}
                            className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition-colors font-medium"
                          >
                            Edit
                          </Link>
                        ) : null}
                        {isSuperadmin || user?.permissions?.canDeleteVideos ? (
                          <button
                            onClick={() => handleDelete(v._id)}
                            className="px-3 py-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 rounded transition-colors font-medium"
                          >
                            Delete
                          </button>
                        ) : null}
                        {!isSuperadmin && !user?.permissions?.canEditVideos && !user?.permissions?.canDeleteVideos && (
                          <span className="text-xs text-slate-400">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > PAGE_SIZE && (
          <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm">
            <span className="text-slate-500">{total} total</span>
            <Pagination page={page} pages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
