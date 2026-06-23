'use client';
import { useState } from 'react';

export default function ShareButtons({ news, iconOnly }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? `${window.location.origin}/news/${news.slug}` : `/news/${news.slug}`;
  const text = news.title;

  const shareLinks = [
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
      color: 'hover:bg-green-500 hover:text-white',
      bg: 'bg-green-50 text-green-600',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-600 hover:text-white',
      bg: 'bg-blue-50 text-blue-600',
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      color: 'hover:bg-black hover:text-white',
      bg: 'bg-slate-100 text-slate-700',
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (iconOnly) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(!open); }}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Share"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        {open && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5 flex gap-1 z-50 whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            {shareLinks.map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${s.bg} ${s.color}`}
                title={s.name}
              >
                {s.name}
              </a>
            ))}
            <button type="button" onClick={(e) => { e.stopPropagation(); copyLink(); }}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        )}
        {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500 font-medium">Share:</span>
      {shareLinks.map(s => (
        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${s.bg} ${s.color}`}
        >
          {s.name}
        </a>
      ))}
      <button type="button" onClick={copyLink}
        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
