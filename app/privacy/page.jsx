'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const en = {
  title: 'Privacy Policy',
  updated: 'Last updated: June 15, 2026',
  intro: 'At DailyNews, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.',
  sections: [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly, such as your name and email address when you contact us or leave a review. We also automatically collect certain technical data including your IP address, browser type, and pages visited to improve our service.'
    },
    {
      title: '2. How We Use Your Information',
      content: 'Your information is used to respond to your inquiries, improve our content and website experience, send updates if you have opted in, and comply with legal obligations. We never sell your personal data to third parties.'
    },
    {
      title: '3. Cookies',
      content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our audience comes from. You can control cookie preferences through your browser settings.'
    },
    {
      title: '4. Data Security',
      content: 'We implement industry-standard security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.'
    },
    {
      title: '5. Your Rights',
      content: 'You have the right to access, correct, or delete your personal data. You may also opt out of any non-essential data collection. To exercise these rights, please contact us.'
    },
    {
      title: '6. Changes to This Policy',
      content: 'We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.'
    },
  ],
};

export default function PrivacyPage() {
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
