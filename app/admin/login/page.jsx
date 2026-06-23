'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
      };
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(data.user.role === 'reporter' ? '/admin/news/create' : '/admin/dashboard');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit() {
    setForgotLoading(true);
    setForgotMessage('');
    setForgotError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotError(data.error || 'Request failed');
        return;
      }
      setForgotMessage(data.message);
      setForgotEmail('');
    } catch {
      setForgotError('Network error');
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">DailyNews</h1>
          <p className="text-slate-400 mt-1">Admin Panel</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {!showForgot ? (
            <>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign in to continue</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-slate-800"
                    placeholder="admin@dailynews.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-slate-800"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => { setShowForgot(true); setError(''); }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <p className="text-center text-xs text-slate-400 mt-4">
                First time? <button onClick={async () => {
                  const r = await fetch('/api/auth/setup', { method: 'POST' });
                  const d = await r.json();
                  if (d.message) toast.success(d.message); if (d.error) toast.error(d.error);
                }} className="text-red-600 hover:underline">Setup superadmin</button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Forgot Password</h2>
              <p className="text-sm text-slate-500 mb-6">Enter your email. The superadmin will receive your request and set a new password.</p>
              {forgotError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {forgotError}
                </div>
              )}
              {forgotMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {forgotMessage}
                </div>
              )}
              <div className="space-y-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800"
                  placeholder="your@email.com"
                />
                <button
                  onClick={handleForgotSubmit}
                  disabled={forgotLoading || !forgotEmail.trim()}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {forgotLoading ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  onClick={() => { setShowForgot(false); setForgotError(''); setForgotMessage(''); }}
                  className="w-full text-center text-sm text-slate-500 hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
