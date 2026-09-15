'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections = [
  {
    title: 'Acceptance of Terms',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    content: 'By accessing and using DailyNews, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website.',
  },
  {
    title: 'Use of Content',
    icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    content: 'All content published on DailyNews, including articles, images, videos, and graphics, is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.',
  },
  {
    title: 'User Conduct',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    content: 'You agree to use the platform for lawful purposes only. You must not post or transmit any harmful, offensive, or misleading content. We reserve the right to remove any user-generated content that violates these terms.',
  },
  {
    title: 'Reviews and Comments',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    content: 'Users may leave reviews and comments on our articles. By submitting content, you grant us a non-exclusive license to use, display, and distribute it. You are solely responsible for your submissions.',
  },
  {
    title: 'Third-Party Links',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    content: 'Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or availability of these external sites.',
  },
  {
    title: 'Limitation of Liability',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
    content: 'DailyNews shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website. We provide the platform on an "as is" and "as available" basis.',
  },
  {
    title: 'Changes to Terms',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    content: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website after changes constitutes acceptance of the new terms.',
  },
];

export default function TermsPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={categories} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 bg-amber-600 text-xs font-bold rounded-full tracking-wider uppercase mb-6">Legal</span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">Terms of Service</h1>
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
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-xl font-black text-slate-900">Agreement to Terms</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">Please read these terms carefully before using the DailyNews website. By accessing or using our platform, you agree to be bound by these terms.</p>
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

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-black mb-2">Need Clarification?</h3>
          <p className="text-amber-100 text-sm mb-4">Reach out if you have questions about these terms.</p>
          <Link href="/contact" className="inline-block px-6 py-2 bg-white text-amber-700 text-sm font-bold rounded-lg hover:bg-amber-50 transition-colors">Contact Us</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
