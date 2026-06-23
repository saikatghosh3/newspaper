'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ news: 0, categories: 0, reporters: 0, reviews: 0 });
  const [recentNews, setRecentNews] = useState([]);
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [resetModal, setResetModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/news?admin=1&limit=5', { headers }).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/reporters', { headers }).then(r => r.json()),
      fetch('/api/reviews?admin=1&status=pending', { headers }).then(r => r.json()),
    ]).then(([newsData, catData, repData, revData]) => {
      setStats({
        news: newsData.total || 0,
        categories: (catData.categories || []).length,
        reporters: (repData.reporters || []).length,
        reviews: (revData.reviews || []).length,
      });
      setRecentNews(newsData.news || []);
    });

    fetchRequests();
  }, []);

  async function fetchRequests() {
    setRequestsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRequests(data.requests || []);
    } catch {} finally {
      setRequestsLoading(false);
    }
  }

  async function handleReset() {
    if (!resetModal || !newPassword || newPassword.length < 6) {
      setActionError('Password must be at least 6 characters');
      return;
    }
    setActionLoading(true);
    setActionError('');
    setActionMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId: resetModal._id, action: 'reset', newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Failed to reset password');
        return;
      }
      setActionMessage(data.message);
      setNewPassword('');
      fetchRequests();
      setTimeout(() => { setResetModal(null); setActionMessage(''); }, 1500);
    } catch {
      setActionError('Network error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBlock(request) {
    if (!confirm(`Block reporter ${request.reporterName || request.email}? This will prevent them from logging in.`)) return;
    setActionLoading(true);
    setActionError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId: request._id, action: 'block' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Failed to block reporter');
        return;
      }
      fetchRequests();
      toast.success(data.message);
    } catch {
      setActionError('Network error');
    } finally {
      setActionLoading(false);
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {user?.name || 'Admin'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here is what is happening with your news portal today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total News" value={stats.news} icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" color="bg-blue-500" />
        <StatCard label="Categories" value={stats.categories} icon="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" color="bg-green-500" />
        <StatCard label="Reporters" value={stats.reporters} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" color="bg-orange-500" />
        <StatCard label="Pending Reviews" value={stats.reviews} icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" color="bg-red-500" />
      </div>

      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm mb-8 border-l-4 border-l-orange-400">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">
              Password Reset Requests
              <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">{pendingRequests.length} pending</span>
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingRequests.map(r => (
              <div key={r._id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-800">{r.reporterName || 'Unknown'}</p>
                  <p className="text-xs text-slate-500">{r.email} &middot; requested {new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setResetModal(r); setNewPassword(''); setActionError(''); setActionMessage(''); }}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-medium"
                    disabled={actionLoading}
                  >
                    Set New Password
                  </button>
                  <button
                    onClick={() => handleBlock(r)}
                    className="px-3 py-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 rounded font-medium"
                    disabled={actionLoading}
                  >
                    Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Recent News</h2>
          <Link href="/admin/news" className="text-red-600 text-sm hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentNews.length === 0 && (
            <p className="text-slate-400 text-sm p-6">No news yet. <Link href="/admin/news/create" className="text-red-600 hover:underline">Create your first article</Link></p>
          )}
          {recentNews.map(n => (
            <div key={n._id} className="flex items-center justify-between p-4 hover:bg-slate-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {n.category?.name} &middot; {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`ml-4 px-2 py-1 text-xs rounded-full font-medium flex-shrink-0 ${
                n.status === 'published' ? 'bg-green-100 text-green-700' :
                n.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {n.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {resetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Reset Password</h3>
            <p className="text-sm text-slate-500 mb-4">
              Setting new password for <strong>{resetModal.reporterName || resetModal.email}</strong>
            </p>
            {actionError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{actionError}</div>
            )}
            {actionMessage && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{actionMessage}</div>
            )}
            <input
              type="text"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 chars)"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                disabled={actionLoading || !newPassword}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-60"
              >
                {actionLoading ? 'Saving...' : 'Save New Password'}
              </button>
              <button
                onClick={() => { setResetModal(null); setNewPassword(''); setActionError(''); setActionMessage(''); }}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
