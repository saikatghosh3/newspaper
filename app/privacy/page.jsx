'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections = [
  {
    title: 'Information We Collect',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    content: 'We collect information you provide directly, such as your name and email address when you contact us or leave a review. We also automatically collect certain technical data including your IP address, browser type, and pages visited to improve our service.',
  },
  {
    title: 'How We Use Your Information',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
    content: 'Your information is used to respond to your inquiries, improve our content and website experience, send updates if you have opted in, and comply with legal obligations. We never sell your personal data to third parties.',
  },
  {
    title: 'Cookies',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our audience comes from. You can control cookie preferences through your browser settings.',
  },
  {
    title: 'Data Security',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    content: 'We implement industry-standard security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.',
  },
  {
    title: 'Your Rights',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    content: 'You have the right to access, correct, or delete your personal data. You may also opt out of any non-essential data collection. To exercise these rights, please contact us.',
  },
  {
    title: 'Changes to This Policy',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    content: 'We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.',
  },
];

export default function PrivacyPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={categories} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 bg-blue-600 text-xs font-bold rounded-full tracking-wider uppercase mb-6">Legal</span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">Last updated: June 15, 2026</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 mb-10 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>

        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-xl font-black text-slate-900">Overview</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">At DailyNews, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mt-0.5">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{section.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-black mb-2">Questions About Privacy?</h3>
          <p className="text-blue-100 text-sm mb-4">Contact us if you have any concerns about your data.</p>
          <Link href="/contact" className="inline-block px-6 py-2 bg-white text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors">Contact Us</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
