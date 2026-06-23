'use client';
import { useState, useEffect, useCallback } from 'react';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 15;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [allNews, setAllNews] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ newsId: '', name: '', email: '', content: '', rating: 5, status: 'approved' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/reviews?admin=1&status=${filter}&page=${page}&limit=${PAGE_SIZE}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setReviews(data.reviews || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [filter, page]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  useEffect(() => {
    fetch('/api/news?admin=1&limit=100').then(r => r.json()).then(d => setAllNews(d.news || []));
  }, []);

  async function handleApprove(id) {
    const token = localStorage.getItem('token');
    await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'approved' }),
    });
    fetchReviews();
  }

  async function handleReject(id) {
    const token = localStorage.getItem('token');
    await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'rejected' }),
    });
    fetchReviews();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this review?')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  }

  async function handleAddReview(e) {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ news: addForm.newsId, name: addForm.name, email: addForm.email, content: addForm.content, rating: addForm.rating, status: addForm.status }),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error || 'Failed to create review'); return; }
      setAddForm({ newsId: '', name: '', email: '', content: '', rating: 5, status: 'approved' });
      setShowAddForm(false);
      fetchReviews();
    } catch { setAddError('Network error'); } finally { setAddLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Reviews</h1>
          <p className="text-sm text-slate-500 mt-1">Manage reader reviews and comments.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Review'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">Add Review as Admin</h3>
          {addError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{addError}</div>}
          <form onSubmit={handleAddReview} className="space-y-4">
            <select value={addForm.newsId} onChange={e => setAddForm({ ...addForm, newsId: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500" required>
              <option value="">Select news article...</option>
              {allNews.map(n => <option key={n._id} value={n._id}>{n.title}</option>)}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Reviewer name" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500" required />
              <input type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} placeholder="Reviewer email" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>
            <div className="flex gap-4">
              <select value={addForm.rating} onChange={e => setAddForm({ ...addForm, rating: parseInt(e.target.value) })} className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500">
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <select value={addForm.status} onChange={e => setAddForm({ ...addForm, status: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <textarea value={addForm.content} onChange={e => setAddForm({ ...addForm, content: e.target.value })} placeholder="Review content" rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" required />
            <button type="submit" disabled={addLoading} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg disabled:opacity-60">
              {addLoading ? 'Adding...' : 'Add Review'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm mb-4 p-3 flex gap-2">
        {['pending', 'approved', 'rejected'].map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s === 'pending' ? 'Pending' : s === 'approved' ? 'Approved' : 'Rejected'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reviews.length === 0 && (
              <div className="text-center py-12 text-slate-400">No {filter} reviews</div>
            )}
            {reviews.map(r => (
              <div key={r._id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {r.reader?.profilePicture ? (
                      <img src={r.reader.profilePicture} alt="" className="w-9 h-9 rounded-full object-cover" />
                    ) : r.reader ? (
                      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-600">{r.reader.name?.charAt(0)?.toUpperCase()}</span>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-500">{r.name?.charAt(0)?.toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-800">{r.reader?.name || r.name}</p>
                      <p className="text-xs text-slate-400">{r.email} • {new Date(r.createdAt).toLocaleDateString()}</p>
                      {r.reader && <p className="text-xs text-blue-500">Registered reader</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(r.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                    </div>
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      r.status === 'approved' ? 'bg-green-100 text-green-700' :
                      r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{r.status}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-3 ml-12">{r.content}</p>
                <div className="flex gap-2 ml-12">
                  {r.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(r._id)}
                        className="px-3 py-1.5 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(r._id)}
                        className="px-3 py-1.5 text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 rounded font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="px-3 py-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 rounded"
                  >
                    Delete
                  </button>
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
