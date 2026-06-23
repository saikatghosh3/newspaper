'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteName: 'DailyNews',
    logo: '',
    logoType: 'url',
    footerText: '',
    facebook: '',
    twitter: '',
    youtube: '',
    selectedLayout: 1,
  });

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.settings) {
        const s = d.settings;
        setForm({
          siteName: s.siteName || 'DailyNews',
          logo: s.logo || '',
          logoType: 'url',
          footerText: s.footerText || '',
          facebook: s.socialLinks?.facebook || '',
          twitter: s.socialLinks?.twitter || '',
          youtube: s.socialLinks?.youtube || '',
          selectedLayout: s.selectedLayout || 1,
        });
      }
      setLoading(false);
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        siteName: form.siteName,
        logo: form.logo,
        footerText: form.footerText,
        selectedLayout: form.selectedLayout,
        socialLinks: {
          facebook: form.facebook,
          twitter: form.twitter,
          youtube: form.youtube,
        },
      }),
    });
    if (res.ok) setSaved(true);
    setSaving(false);
  }

  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Logo must be smaller than 2MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, logo: reader.result, logoType: 'upload' });
    reader.readAsDataURL(file);
  }

  if (loading) return (
    <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full" /></div>
  );

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Website Settings</h1>

      {saved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Branding
          </h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
            <input value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Logo</label>
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="radio" name="logoSrc" checked={form.logoType === 'url'}
                  onChange={() => setForm({ ...form, logoType: 'url', logo: '' })} className="h-4 w-4 text-red-600" />
                Image URL
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="radio" name="logoSrc" checked={form.logoType === 'upload'}
                  onChange={() => setForm({ ...form, logoType: 'upload', logo: '' })} className="h-4 w-4 text-red-600" />
                Upload File
              </label>
            </div>
            {form.logoType === 'url' ? (
              <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800" />
            ) : (
              <input type="file" accept="image/*" onChange={handleLogoUpload}
                className="w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
            )}
            {form.logo && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <img src={form.logo} alt="logo preview" className="h-12 w-auto object-contain rounded" />
                <span className="text-xs text-slate-500">Logo preview</span>
              </div>
            )}
          </div>
        </div>

        {/* Layout */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            Layout
          </h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Homepage Layout</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 1, label: 'Featured Top', desc: 'Hero + grid layout' },
                { id: 2, label: 'Grid View', desc: 'Cards in 4 columns' },
                { id: 3, label: 'Sidebar', desc: 'Content + right sidebar' },
              ].map(l => (
                <button key={l.id} type="button" onClick={() => setForm({ ...form, selectedLayout: l.id })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${form.selectedLayout === l.id ? 'border-red-600 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="w-full h-16 bg-slate-100 rounded mb-2 flex items-center justify-center">
                    <span className="text-slate-400 font-bold text-lg">Layout {l.id}</span>
                  </div>
                  <p className="font-medium text-sm text-slate-800">{l.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{l.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
            Footer
          </h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Footer Text</label>
            <textarea value={form.footerText} onChange={e => setForm({ ...form, footerText: e.target.value })}
              rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800 resize-none"
              placeholder="Description shown in the footer" />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            Social Media Links
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </div>
              <input value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })}
                placeholder="https://facebook.com/yourpage"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </div>
              <input value={form.twitter} onChange={e => setForm({ ...form, twitter: e.target.value })}
                placeholder="https://twitter.com/yourprofile"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </div>
              <input value={form.youtube} onChange={e => setForm({ ...form, youtube: e.target.value })}
                placeholder="https://youtube.com/@yourchannel"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800" />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
            {saving && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
