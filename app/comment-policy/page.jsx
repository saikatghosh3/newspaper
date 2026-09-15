'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const rules = [
  { title: 'Be Respectful', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', desc: 'Treat others with respect. Personal attacks, harassment, hate speech, or discriminatory language will not be tolerated.' },
  { title: 'Stay on Topic', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', desc: 'Keep comments relevant to the article. Off-topic posts may be removed to maintain focused discussion.' },
  { title: 'No Spam', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', desc: 'Do not post promotional content, advertisements, or repetitive messages. Comments that appear to be spam will be deleted.' },
  { title: 'Use Appropriate Language', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', desc: 'Refrain from using profanity, obscene language, or adult content. Comments should be suitable for a general audience.' },
  { title: 'No False Information', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', desc: 'Do not knowingly share false or misleading information. Factual claims should be supported by credible sources.' },
  { title: 'Respect Privacy', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', desc: 'Do not post personal information about yourself or others, including addresses, phone numbers, or private contact details.' },
  { title: 'Moderation', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', desc: 'All comments are reviewed before publication. We reserve the right to edit, reject, or remove any comment that violates this policy.' },
  { title: 'Reporting', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', desc: 'If you see a comment that violates this policy, please contact us immediately so we can review and take appropriate action.' },
];

export default function CommentPolicyPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={categories} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 bg-emerald-600 text-xs font-bold rounded-full tracking-wider uppercase mb-6">Community</span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">Comment Policy</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">Guidelines for constructive and respectful discussion.</p>
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
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
            </div>
            <h2 className="text-xl font-black text-slate-900">Our Guidelines</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">We welcome your comments and encourage lively discussion on our articles. To keep the conversation respectful and productive, please follow these guidelines.</p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mt-0.5">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={rule.icon} /></svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{i + 1}. {rule.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-black mb-2">Help Us Maintain a Positive Community</h3>
          <p className="text-emerald-100 text-sm">By submitting a comment, you agree to abide by this policy. Thank you for your cooperation.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
