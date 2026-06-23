'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const en = {
  title: 'Terms of Service',
  updated: 'Last updated: June 15, 2026',
  intro: 'Please read these terms of service carefully before using the DailyNews website. By accessing or using our platform, you agree to be bound by these terms.',
  sections: [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using DailyNews, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website.'
    },
    {
      title: '2. Use of Content',
      content: 'All content published on DailyNews, including articles, images, videos, and graphics, is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.'
    },
    {
      title: '3. User Conduct',
      content: 'You agree to use the platform for lawful purposes only. You must not post or transmit any harmful, offensive, or misleading content. We reserve the right to remove any user-generated content that violates these terms.'
    },
    {
      title: '4. Reviews and Comments',
      content: 'Users may leave reviews and comments on our articles. By submitting content, you grant us a non-exclusive license to use, display, and distribute it. You are solely responsible for your submissions.'
    },
    {
      title: '5. Third-Party Links',
      content: 'Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or availability of these external sites.'
    },
    {
      title: '6. Limitation of Liability',
      content: 'DailyNews shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website. We provide the platform on an "as is" and "as available" basis.'
    },
    {
      title: '7. Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website after changes constitutes acceptance of the new terms.'
    },
  ],
};

export default function TermsPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  const t = en;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={categories} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-2">{t.title}</h1>
          <p className="text-sm text-slate-400 mb-6">{t.updated}</p>
          <p className="text-slate-700 mb-8 leading-relaxed">{t.intro}</p>

          <div className="space-y-8">
            {t.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h2>
                <p className="text-slate-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
