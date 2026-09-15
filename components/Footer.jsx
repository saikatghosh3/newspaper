'use client';
import Link from 'next/link';
import AdDisplay from '@/components/AdDisplay';
import { useSettings } from '@/components/SettingsProvider';

export default function Footer() {
  const settings = useSettings();

  const siteName = settings?.siteName || 'DailyNews';
  const footerText = settings?.footerText || '';
  const social = settings?.socialLinks || {};
  const logoUrl = settings?.logo;

  return (
    <footer className="bg-slate-950 text-slate-300 mt-16">
      <AdDisplay position="footer" className="flex justify-center py-4 bg-slate-900" />
      
      {/* Top Quick Links Bar - Desktop Only */}
      <div className="hidden md:block bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 py-4">
            <Link href="/about" className="relative px-3 py-1.5 text-sm font-medium text-white hover:text-white transition-colors group">
              About Us
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white rounded-full group-hover:w-3/4 transition-all duration-300" />
            </Link>
            <span className="text-white/40">|</span>
            <Link href="/contact" className="relative px-3 py-1.5 text-sm font-medium text-white hover:text-white transition-colors group">
              Contact Us
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white rounded-full group-hover:w-3/4 transition-all duration-300" />
            </Link>
            <span className="text-white/40">|</span>
            <Link href="/comment-policy" className="relative px-3 py-1.5 text-sm font-medium text-white hover:text-white transition-colors group">
              Comment Policy
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white rounded-full group-hover:w-3/4 transition-all duration-300" />
            </Link>
            <span className="text-white/40">|</span>
            <Link href="/newsletter" className="relative px-3 py-1.5 text-sm font-medium text-white hover:text-white transition-colors group">
              Newsletter
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white rounded-full group-hover:w-3/4 transition-all duration-300" />
            </Link>
            <span className="text-white/40">|</span>
            <Link href="/privacy" className="relative px-3 py-1.5 text-sm font-medium text-white hover:text-white transition-colors group">
              Privacy Policy
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white rounded-full group-hover:w-3/4 transition-all duration-300" />
            </Link>
            <span className="text-white/40">|</span>
            <Link href="/terms" className="relative px-3 py-1.5 text-sm font-medium text-white hover:text-white transition-colors group">
              Terms of Service
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white rounded-full group-hover:w-3/4 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-10 w-10 rounded-full object-cover shrink-0" />
              ) : (
                <img src="/logo.jpg" alt={siteName} className="h-10 w-10 rounded-full object-cover shrink-0" />
              )}
              <span className="text-2xl font-black text-white tracking-tight">{siteName}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              {footerText || 'Your trusted source for the latest news, analysis, and updates. Stay informed with breaking news from around the world.'}
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3 mt-6">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-blue-600 rounded-xl text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/20"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-sky-500 rounded-xl text-sm transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-red-600 rounded-xl text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </a>
              )}
              {!social.facebook && !social.twitter && !social.youtube && (
                <p className="text-sm text-slate-500">No social links configured.</p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="relative inline-block text-sm text-slate-400 hover:text-white transition-colors group">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="relative inline-block text-sm text-slate-400 hover:text-white transition-colors group">
                  About Us
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="relative inline-block text-sm text-slate-400 hover:text-white transition-colors group">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="relative inline-block text-sm text-slate-400 hover:text-white transition-colors group">
                  Newsletter
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/videos" className="relative inline-block text-sm text-slate-400 hover:text-white transition-colors group">
                  Videos
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="relative inline-block text-sm text-slate-400 hover:text-white transition-colors group">
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="relative inline-block text-sm text-slate-400 hover:text-white transition-colors group">
                  Terms of Service
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/comment-policy" className="relative inline-block text-sm text-slate-400 hover:text-white transition-colors group">
                  Comment Policy
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live Updates
            </span>
            <span>Powered by {siteName}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
