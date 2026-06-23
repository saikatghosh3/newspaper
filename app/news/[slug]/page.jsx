'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, updateProfile } from '@/lib/redux/readerSlice';
import Navbar from '@/components/Navbar';
import { formatDate } from '@/lib/utils';
import ShareButtons from '@/components/ShareButtons';
import AdDisplay from '@/components/AdDisplay';
import { useSettings } from '@/components/SettingsProvider';
import { ArticleSkeleton } from '@/components/Skeleton';
import Footer from '@/components/Footer';

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

export default function NewsDetailPage({ params }) {
  const dispatch = useDispatch();
  const { reader, isLoggedIn } = useSelector(s => s.reader);
  const [news, setNews] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const settings = useSettings();

  const [showAuth, setShowAuth] = useState(false);
  const [authAction, setAuthAction] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', profilePicture: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/news/slug/${params.slug}`)
      .then(r => r.json())
      .then(d => {
        if (cancelled) return;
        setNews(d.news);
        setReviews(d.reviews || []);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [params.slug]);

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
    fetch(`/api/reviews?newsId=${news._id}`).then(r => r.json()).then(d => {
      if (d.reviews) setReviews(d.reviews);
    });
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

  if (!news) return (
    <div className="min-h-screen bg-white">
      <Navbar categories={categories} />
      <ArticleSkeleton />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar categories={categories} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="text-red-600 text-sm hover:underline mb-6 inline-block">← Back to Home</Link>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <article>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full mb-4">
                  {news.category?.name}
                </span>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">{news.title}</h1>
                <div className="flex items-center gap-4 text-slate-600 text-sm">
                  <span>{news.author?.name}</span>
                  <span>{formatDate(news.publishedAt)}</span>
                  <span>{news.views} views</span>
                </div>
                <div className="mt-4">
                  <ShareButtons news={news} />
                </div>
              </div>

              {news.featuredImage && (
                <div className="relative w-full h-56 md:h-96 rounded-lg overflow-hidden mb-8 group">
                  <img src={news.featuredImage} alt={news.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-[2px] rounded px-2 py-1 flex items-center gap-1.5 pointer-events-none select-none">
                    {settings?.logo && (
                      <img src={settings.logo} alt="" className="h-4 w-auto opacity-70" />
                    )}
                    <span className="text-[10px] font-bold text-white/60 tracking-wider uppercase">
                      {settings?.siteName || 'DailyNews'}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white text-sm font-medium leading-relaxed drop-shadow-lg">
                      {news.title.split(' ').slice(0, 5).join(' ') + (news.title.split(' ').length > 5 ? '...' : '')}
                    </p>
                  </div>
                </div>
              )}

              {news.newsHighlight && (
                <div
                  className="mb-8 p-5 bg-red-50 border-l-4 border-red-600 rounded-r-lg text-slate-800 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: news.newsHighlight }}
                />
              )}

              <div className="prose prose-sm max-w-none mb-12 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {news.content}
              </div>
            </article>

            <AdDisplay position="inline" className="mb-12 flex justify-center" />

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
            </div>
          </div>
          <aside className="lg:col-span-3 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              <AdDisplay position="sidebar" />
            </div>
          </aside>
        </div>
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

      <Footer />
    </div>
  );
}
