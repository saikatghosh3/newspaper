'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import Pagination from '@/components/Pagination';

export default function AdminNewsPage() {
  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '' });
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ admin: '1', page, limit: '8' });
    if (filter.status) params.set('status', filter.status);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/news?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNews(data.news || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [filter, page]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  async function handleStatusChange(id, status) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) toast.error((await res.json()).error || 'Could not update status');
    fetchNews();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this news article?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/news/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) toast.error((await res.json()).error || 'Could not delete news');
    fetchNews();
  }

  async function toggleTrending(id, current) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isTrending: !current }),
    });
    if (!res.ok) toast.error((await res.json()).error || 'Could not update trending');
    fetchNews();
  }

  const permissions = user?.permissions || {};
  const isSuperadmin = user?.role === 'superadmin';
  const canCreate = isSuperadmin || permissions.canCreateNews;
  const canEdit = isSuperadmin || permissions.canEditNews;
  const canDelete = isSuperadmin || permissions.canDeleteNews;
  const canPublish = isSuperadmin || permissions.canPublishNews;
  const canTrend = isSuperadmin || permissions.canTrendNews;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">News Management</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total articles</p>
        </div>
        {canCreate && (
          <Link
            href="/admin/news/create"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Create News
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-4 p-4 flex flex-wrap gap-3">
        <select
          value={filter.status}
          onChange={e => { setFilter({ ...filter, status: e.target.value }); setPage(1); }}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-slate-600 font-semibold">Title</th>
                <th className="text-left px-4 py-3 text-slate-600 font-semibold hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-slate-600 font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-slate-600 font-semibold hidden lg:table-cell">Trending</th>
                <th className="text-right px-4 py-3 text-slate-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {news.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400">No news found</td></tr>
              )}
              {news.map(n => (
                <tr key={n._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800 line-clamp-1">{n.title}</p>
                    <p className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{n.category?.name || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={n.status}
                      onChange={e => handleStatusChange(n._id, e.target.value)}
                      disabled={!canPublish}
                      className={`text-xs px-2 py-1 rounded border-0 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 ${
                        n.status === 'published' ? 'bg-green-100 text-green-700' :
                        n.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <button
                      onClick={() => toggleTrending(n._id, n.isTrending)}
                      disabled={!canTrend}
                      className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                        n.isTrending ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {n.isTrending ? 'Trending' : 'Set Trending'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <Link
                          href={`/admin/news/edit/${n._id}`}
                          className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition-colors font-medium"
                        >
                          Edit
                        </Link>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(n._id)}
                          className="px-3 py-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 rounded transition-colors font-medium"
                        >
                          Delete
                        </button>
                      )}
                      {!canEdit && !canDelete && <span className="text-xs text-slate-400">No actions</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {total > 8 && (
          <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm">
            <span className="text-slate-500">{total} total</span>
            <Pagination page={page} pages={Math.ceil(total / 8)} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
