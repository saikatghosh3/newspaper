'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, updateProfile } from '@/lib/redux/readerSlice';
import { formatDate } from '@/lib/utils';

const AVATARS = [
  'https://api.dicebear.com/7.x/initials/svg?seed=',
  'https://ui-avatars.com/api/?name=',
];

function ReaderAvatar({ name, url, size = 'w-8 h-8' }) {
  if (url) {
    return <img src={url} alt={name} className={`${size} rounded-full object-cover`} />;
  }
  return (
    <div className={`${size} rounded-full bg-red-100 flex items-center justify-center`}>
      <span className="text-xs font-bold text-red-600">{name?.charAt(0)?.toUpperCase() || '?'}</span>
    </div>
  );
}

export default function NewsDetailClient({ news, reviews: initialReviews }) {
  const dispatch = useDispatch();
  const { reader, isLoggedIn } = useSelector(s => s.reader);
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const [showAuth, setShowAuth] = useState(false);
  const [authAction, setAuthAction] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', profilePicture: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/reader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: authAction, ...authForm }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        return;
      }
      dispatch(login({ reader: data.reader, token: data.token }));
      setShowAuth(false);
      setAuthForm({ name: '', email: '', password: '' });
    } catch {
      setAuthError('Network error');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!isLoggedIn) { setShowAuth(true); return; }
    setSubmitting(true);
    const token = localStorage.getItem('reader_token');
    const payload = {
      news: news._id,
      name: reader.name,
      email: reader.email,
      content: reviewContent,
      rating: reviewRating,
      reader: reader.id,
    };
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    setReviewContent('');
    setReviewRating(5);
    const r = await fetch(`/api/reviews?newsId=${news._id}`).then(r => r.json());
    if (r.reviews) setReviews(r.reviews);
    setSubmitting(false);
  }

  function openProfile() {
    setProfileForm({
      name: reader?.name || '',
      phone: reader?.phone || '',
      address: reader?.address || '',
      profilePicture: reader?.profilePicture || '',
    });
    setProfileMessage('');
    setShowProfile(true);
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    try {
      const token = localStorage.getItem('reader_token');
      const res = await fetch('/api/auth/reader', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMessage(data.error || 'Failed to save');
        return;
      }
      dispatch(updateProfile(data.reader));
      setProfileMessage('Profile updated successfully.');
    } catch {
      setProfileMessage('Network error');
    } finally {
      setProfileSaving(false);
    }
  }

  return (
    <div className="border-t pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Reviews ({reviews.length})</h2>
        {isLoggedIn && (
          <div className="flex items-center gap-3">
            <button onClick={openProfile} className="text-sm text-red-600 hover:underline">Edit Profile</button>
            <button onClick={() => dispatch(logout())} className="text-sm text-slate-500 hover:underline">Logout</button>
          </div>
        )}
      </div>

      {isLoggedIn ? (
        <form onSubmit={handleReviewSubmit} className="bg-slate-50 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ReaderAvatar name={reader.name} url={reader.profilePicture} />
            <div>
              <p className="font-medium text-slate-800 text-sm">{reader.name}</p>
              <p className="text-xs text-slate-400">{reader.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600 block mb-2">Rating</label>
              <select
                value={reviewRating}
                onChange={e => setReviewRating(parseInt(e.target.value))}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <textarea
              value={reviewContent}
              onChange={e => setReviewContent(e.target.value)}
              placeholder="Write your review..."
              rows={4}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 rounded-lg p-6 mb-8 text-center">
          <p className="text-slate-600 mb-3">Create an account to leave a review.</p>
          <button
            onClick={() => setShowAuth(true)}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Sign In / Register
          </button>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 && <p className="text-slate-500 text-center py-8">No approved reviews yet.</p>}
        {reviews.map(r => (
          <div key={r._id} className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                {r.reader ? (
                  <ReaderAvatar name={r.reader.name || r.name} url={r.reader.profilePicture} size="w-9 h-9" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500">{r.name?.charAt(0)?.toUpperCase() || '?'}</span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-800 text-sm">{r.reader?.name || r.name}</p>
                  <p className="text-xs text-slate-400">{formatDate(r.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(r.rating)].map((_, i) => <span key={i} className="text-yellow-500">★</span>)}
              </div>
            </div>
            <p className="text-slate-700 text-sm ml-12">{r.content}</p>
          </div>
        ))}
      </div>

      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              {authAction === 'login' ? 'Sign In' : 'Create Account'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {authAction === 'login' ? 'Sign in to leave a review.' : 'Register to start reviewing articles.'}
            </p>
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{authError}</div>
            )}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authAction === 'register' && (
                <input
                  value={authForm.name}
                  onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800"
                  required
                />
              )}
              <input
                type="email"
                value={authForm.email}
                onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                placeholder="Your email"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800"
                required
              />
              <input
                type="password"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                placeholder="Password (min 6 characters)"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800"
                required
                minLength={6}
              />
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
              >
                {authLoading ? 'Please wait...' : authAction === 'login' ? 'Sign In' : 'Register'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => { setAuthAction(authAction === 'login' ? 'register' : 'login'); setAuthError(''); }}
                className="text-sm text-red-600 hover:underline"
              >
                {authAction === 'login' ? 'Need an account? Register' : 'Already have an account? Sign In'}
              </button>
            </div>
            <button
              onClick={() => setShowAuth(false)}
              className="mt-4 w-full text-center text-sm text-slate-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Edit Profile</h3>
            <p className="text-sm text-slate-500 mb-6">Update your personal information.</p>
            {profileMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${profileMessage.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {profileMessage}
              </div>
            )}
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <ReaderAvatar name={profileForm.name || reader?.name} url={profileForm.profilePicture} size="w-16 h-16" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Profile Picture URL</label>
                  <input
                    value={profileForm.profilePicture}
                    onChange={e => setProfileForm({ ...profileForm, profilePicture: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800 text-sm"
                  />
                </div>
              </div>
              <input
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Full name"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800"
                required
              />
              <input
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="Phone number"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800"
              />
              <textarea
                value={profileForm.address}
                onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                placeholder="Your address"
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800 resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
                >
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfile(false)}
                  className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
