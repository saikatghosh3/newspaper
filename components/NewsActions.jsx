'use client';
import { useState, useEffect } from 'react';
import ShareButtons from '@/components/ShareButtons';

export default function NewsActions({ news }) {
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  return (
    <>
      <style>{`
        .print-only {
          display: none !important;
        }
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-only,
          .print-only * {
            visibility: visible !important;
          }
          .print-only {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
            background: white !important;
          }
          .print-only img {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            margin-bottom: 16px !important;
          }
          .print-only h1 {
            font-size: 24pt !important;
            color: #000 !important;
            margin-bottom: 12px !important;
          }
          .print-only .print-meta {
            font-size: 10pt !important;
            color: #555 !important;
            margin-bottom: 16px !important;
            padding-bottom: 12px !important;
            border-bottom: 1px solid #ddd !important;
          }
          .print-only .print-body {
            font-size: 11pt !important;
            line-height: 1.6 !important;
            color: #000 !important;
            white-space: pre-wrap !important;
          }
          .print-only .print-source {
            margin-top: 20px !important;
            padding-top: 12px !important;
            border-top: 1px solid #ddd !important;
            font-size: 9pt !important;
            color: #888 !important;
          }
        }
      `}</style>

      <div className="print-only" aria-hidden="true">
        <h1>{news.title}</h1>
        <div className="print-meta">
          {news.author?.name && <span>{news.author.name}</span>}
          {news.publishedAt && <span> | {new Date(news.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
        </div>
        {news.featuredImage && (
          <img src={news.featuredImage} alt={news.title} />
        )}
        {news.newsHighlight && (
          <div style={{ fontStyle: 'italic', borderLeft: '3px solid #dc2626', paddingLeft: '12px', marginBottom: '16px', color: '#333' }}>
            {news.newsHighlight.replace(/<[^>]*>/g, '')}
          </div>
        )}
        <div className="print-body">{news.content}</div>
        {pageUrl && (
          <div className="print-source">Source: {pageUrl}</div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 py-4 border-y border-slate-200 no-print">
        <ShareButtons news={news} />
        <div className="h-5 w-px bg-slate-200 hidden sm:block" />
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Print this article"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      </div>
    </>
  );
}
