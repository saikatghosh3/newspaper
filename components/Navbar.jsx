'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdDisplay from '@/components/AdDisplay';
import { useSettings } from '@/components/SettingsProvider';

function binarySearchPrefix(arr, prefix) {
  const q = prefix.toLowerCase();
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid]._sortKey < q) lo = mid + 1;
    else hi = mid;
  }
  const results = [];
  for (let i = lo; i < arr.length; i++) {
    if (!arr[i]._sortKey.startsWith(q)) break;
    if (results.length >= 6) break;
    results.push(arr[i]);
  }
  return results;
}

export default function Navbar({ categories = [], activeCategorySlug }) {
  const settings = useSettings();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allNews, setAllNews] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchOpen]);

  const fetchAllNews = useCallback(async () => {
    if (allNews.length > 0) return;
    try {
      const res = await fetch('/api/search');
      const data = await res.json();
      if (data.news) {
        const mapped = data.news.map(n => ({
          title: n.title,
          slug: n.slug,
          _sortKey: n.title.toLowerCase(),
        }));
        setAllNews(mapped);
      }
    } catch {}
  }, [allNews.length]);

  function handleSearchInput(e) {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    const results = binarySearchPrefix(allNews, val.trim());
    setSearchResults(results);
  }

  function handleSearchToggle() {
    if (!searchOpen) {
      fetchAllNews();
      setSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchOpen(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleCategories = categories.slice(0, 6);
  const moreCategories = categories.slice(6);
  const logoUrl = settings?.logo;
  const siteName = settings?.siteName || 'DailyNews';

  function navLinkClass(slug) {
    const isActive = slug === activeCategorySlug || (slug === 'home' && pathname === '/');
    const base = 'relative px-1 py-2 text-sm font-semibold transition-colors whitespace-nowrap group';
    if (isActive) {
      return `${base} text-red-600`;
    }
    return `${base} text-slate-700 hover:text-red-600`;
  }

  function navUnderline(slug) {
    const isActive = slug === activeCategorySlug || (slug === 'home' && pathname === '/');
    if (isActive) {
      return 'absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full';
    }
    return 'absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left';
  }

  return (
    <>
      <AdDisplay position="header" className="bg-slate-100 py-2 flex justify-center" />

      {/* Upper Top Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/newsletter" className="hover:text-white transition-colors">Newsletter</Link>
              <span className="text-slate-600">|</span>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <span className="text-slate-600">|</span>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt={siteName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <img src="/logo.jpg" alt={siteName} className="h-10 w-10 rounded-full object-cover" />
                )}
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black tracking-tight text-slate-950 group-hover:text-red-600 transition-colors">{siteName}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-5 min-w-0">
              <Link href="/" className={navLinkClass('home')}>
                <span className="relative">Home</span>
                <span className={navUnderline('home')} />
              </Link>
              <Link href="/videos" className={navLinkClass('/videos')}>
                <span className="relative">Videos</span>
                <span className={navUnderline('/videos')} />
              </Link>
              {visibleCategories.map(category => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug}`}
                  className={navLinkClass(category.slug)}
                >
                  <span className="relative">{category.name}</span>
                  <span className={navUnderline(category.slug)} />
                </Link>
              ))}
              {moreCategories.length > 0 && (
                <div className="relative group">
                  <button className="relative px-1 py-2 text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors group">
                    <span className="relative">More</span>
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </button>
                  <div className="absolute right-0 top-full hidden group-hover:block pt-3">
                    <div className="w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-2">
                      {moreCategories.map(category => (
                        <Link
                          key={category._id}
                          href={`/category/${category.slug}`}
                          className={`block px-4 py-2.5 text-sm font-medium transition-colors ${category.slug === activeCategorySlug ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-700 hover:bg-red-50 hover:text-red-600'}`}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSearchToggle}
                className="p-2.5 rounded-full text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link href="/admin/login" className="hidden sm:inline-flex p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" aria-label="Admin">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Panel */}
        {searchOpen && (
          <div ref={searchRef} className="border-t border-slate-200 bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="relative max-w-2xl mx-auto">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-slate-800 text-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults([]); inputRef.current?.focus(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-3 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                  {searchResults.length === 0 ? (
                    <p className="text-sm text-slate-400 py-8 text-center">No articles found.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {searchResults.map(item => (
                        <Link
                          key={item.slug}
                          href={`/news/${item.slug}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                          <span className="text-sm font-medium text-slate-700 truncate">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              <Link
                href="/"
                className={`block px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                  pathname === '/' ? 'bg-red-600 text-white' : 'text-slate-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                Home
              </Link>
              {categories.map(category => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug}`}
                  className={`block px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                    category.slug === activeCategorySlug
                      ? 'bg-red-600 text-white'
                      : 'text-slate-700 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
                <Link
                  href="/videos"
                  className={`block px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                    pathname === '/videos' ? 'bg-red-600 text-white' : 'text-slate-700 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  Videos
                </Link>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
