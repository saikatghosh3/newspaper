'use client';
import Link from 'next/link';
import AdDisplay from '@/components/AdDisplay';
import { useSettings } from '@/components/SettingsProvider';

export default function Footer() {
  const settings = useSettings();

  const siteName = settings?.siteName || 'DailyNews';
  const footerText = settings?.footerText || '';
  const social = settings?.socialLinks || {};

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <AdDisplay position="footer" className="flex justify-center py-4 bg-slate-800" />
      <div className="border-b border-slate-800 bg-red-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-4 bg-red-500">
            <Link href="/about" className="px-4 py-2 text-sm font-medium text-white hover:text-white hover:bg-slate-800 rounded-lg transition-colors">About Us</Link>
            <Link href="/contact" className="px-4 py-2 text-sm font-medium text-white hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Contact Us</Link>
            <Link href="/comment-policy" className="px-4 py-2 text-sm font-medium text-white hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Comment Policy</Link>
            <Link href="/newsletter" className="px-4 py-2 text-sm font-medium text-white hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Newsletter</Link>
            <Link href="/privacy" className="px-4 py-2 text-sm font-medium text-white hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="px-4 py-2 text-sm font-medium text-white hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-red-600 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tight">{siteName}</span>
            </div>
            <p className="text-sm leading-relaxed">
              {footerText || 'Your trusted source for the latest news, analysis, and updates.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-sm hover:text-red-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-sm hover:text-red-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-red-400 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-red-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-red-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-sky-600 rounded-lg text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600 rounded-lg text-sm transition-colors"
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
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p>Powered by DailyNews</p>
        </div>
      </div>
    </footer>
  );
}
