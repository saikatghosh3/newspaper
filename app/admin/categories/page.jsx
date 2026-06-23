'use client';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, FolderKanban } from 'lucide-react';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 30;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', color: '#dc2626' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    const res = await fetch(`/api/categories?admin=1&page=${page}&limit=${PAGE_SIZE}`);
    const data = await res.json();
    setCategories(data.categories || []);
    setTotal(data.total || 0);
  }, [page]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { setPage(1); }, []);

  function resetForm() {
    setForm({ name: '', color: '#dc2626' });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(category) {
    setForm({
      name: category.name || '',
      color: category.color || '#dc2626',
    });
    setEditingId(category._id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
    const res = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      resetForm();
      fetchCategories();
      toast.success(editingId ? 'Category updated' : 'Category created');
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Could not save category');
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCategories();
    toast.success('Category deleted');
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Categories</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {total} {total === 1 ? 'category' : 'categories'}
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm && !editingId) {
              resetForm();
              return;
            }
            setForm({ name: '', color: '#dc2626' });
            setEditingId(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          New Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Category name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={e => setForm({ ...form, color: e.target.value })}
                    className="w-8 h-8 border border-slate-300 rounded cursor-pointer bg-white p-0.5"
                  />
                  <div
                    className="w-6 h-6 rounded border border-slate-200 shrink-0"
                    style={{ backgroundColor: form.color }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {total === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 py-10 text-center">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FolderKanban className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-700 mb-1">No categories yet</p>
          <p className="text-xs text-slate-500 mb-3">Create your first category to organize news.</p>
          <button
            onClick={() => { setForm({ name: '', color: '#dc2626' }); setEditingId(null); setShowForm(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {categories.map(c => (
            <div
              key={c._id}
              className="group bg-white rounded-lg shadow-sm border border-slate-200 px-3 py-2.5 hover:shadow transition-shadow"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded shrink-0"
                  style={{ backgroundColor: c.color || '#dc2626' }}
                />
                <span className="text-sm font-medium text-slate-800 truncate flex-1">{c.name}</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <button
                  onClick={() => handleEdit(c)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex justify-center mt-6">
          <Pagination page={page} pages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
