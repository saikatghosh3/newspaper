'use client';
import { useState, useEffect, useCallback } from 'react';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 20;

const defaultPermissions = {
  canCreateNews: true,
  canEditNews: false,
  canDeleteNews: false,
  canPublishNews: false,
  canFeatureNews: false,
  canTrendNews: false,
  canUploadVideos: false,
  canEditVideos: false,
  canDeleteVideos: false,
};

const permissionOptions = [
  { key: 'canCreateNews', label: 'Upload news' },
  { key: 'canEditNews', label: 'Edit own news' },
  { key: 'canPublishNews', label: 'Publish news' },
  { key: 'canTrendNews', label: 'Set trending' },
  { key: 'canFeatureNews', label: 'Set featured' },
  { key: 'canDeleteNews', label: 'Delete own news' },
  { key: 'canUploadVideos', label: 'Upload video news' },
  { key: 'canEditVideos', label: 'Edit video news' },
  { key: 'canDeleteVideos', label: 'Delete video news' },
];

export default function ReportersPage() {
  const [reporters, setReporters] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', isActive: true, permissions: defaultPermissions });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReporters = useCallback(async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/reporters?page=${page}&limit=${PAGE_SIZE}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setReporters(data.reporters || []);
    setTotal(data.total || 0);
  }, [page]);

  useEffect(() => { fetchReporters(); }, [fetchReporters]);

  function resetForm() {
    setForm({ name: '', email: '', password: '', isActive: true, permissions: defaultPermissions });
    setEditingId(null);
    setShowForm(false);
    setError('');
  }

  function startEdit(reporter) {
    setForm({
      name: reporter.name || '',
      email: reporter.email || '',
      password: '',
      isActive: reporter.isActive !== false,
      permissions: { ...defaultPermissions, ...(reporter.permissions || {}) },
    });
    setEditingId(reporter._id);
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const payload = { ...form };
    if (editingId && !payload.password) delete payload.password;

    const res = await fetch(editingId ? `/api/reporters/${editingId}` : '/api/reporters', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      resetForm();
      fetchReporters();
    } else {
      setError(data.error || 'Could not save reporter');
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this reporter?')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/reporters/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReporters();
  }

  function setPermission(key, value) {
    setForm({
      ...form,
      permissions: { ...form.permissions, [key]: value },
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reporters</h1>
          <p className="text-sm text-slate-500 mt-1">{total} total &middot; Default access is only news upload.</p>
        </div>
        <button
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Reporter
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Reporter name"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder={editingId ? 'New password (optional)' : 'Password'}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                required={!editingId}
              />
              <label className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                Active account
              </label>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Reporter access</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {permissionOptions.map(option => (
                  <label key={option.key} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(form.permissions[option.key])}
                      onChange={e => setPermission(option.key, e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg disabled:opacity-60"
              >
                {loading ? 'Saving...' : editingId ? 'Update Reporter' : 'Add Reporter'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {total === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-white rounded-xl shadow-sm border border-slate-200">No reporters yet</div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Access</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reporters.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-slate-400">No reporters yet</td></tr>
                )}
                {reporters.map(r => {
                  const activePermissions = permissionOptions.filter(option => r.permissions?.[option.key]).map(option => option.label);
                  return (
                    <tr key={r._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {r.name}
                        {r.isActive === false && <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">Inactive</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{r.email}</td>
                      <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                        {activePermissions.length ? activePermissions.join(', ') : 'No access'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(r)}
                            className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="px-3 py-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
