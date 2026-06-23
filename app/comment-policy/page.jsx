'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CommentPolicyPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={categories} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-2">Comment Policy</h1>
          <p className="text-lg text-red-600 font-semibold mb-8">Guidelines for constructive discussion.</p>

          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p>We welcome your comments and encourage lively discussion on our articles. To keep the conversation respectful and productive, please follow these guidelines.</p>

            <h2 className="text-xl font-bold text-slate-900">1. Be Respectful</h2>
            <p>Treat others with respect. Personal attacks, harassment, hate speech, or discriminatory language will not be tolerated.</p>

            <h2 className="text-xl font-bold text-slate-900">2. Stay on Topic</h2>
            <p>Keep comments relevant to the article. Off-topic posts may be removed to maintain focused discussion.</p>

            <h2 className="text-xl font-bold text-slate-900">3. No Spam</h2>
            <p>Do not post promotional content, advertisements, or repetitive messages. Comments that appear to be spam will be deleted.</p>

            <h2 className="text-xl font-bold text-slate-900">4. Use Appropriate Language</h2>
            <p>Refrain from using profanity, obscene language, or adult content. Comments should be suitable for a general audience.</p>

            <h2 className="text-xl font-bold text-slate-900">5. No False Information</h2>
            <p>Do not knowingly share false or misleading information. Factual claims should be supported by credible sources.</p>

            <h2 className="text-xl font-bold text-slate-900">6. Respect Privacy</h2>
            <p>Do not post personal information about yourself or others, including addresses, phone numbers, or private contact details.</p>

            <h2 className="text-xl font-bold text-slate-900">7. Moderation</h2>
            <p>All comments are reviewed before publication. We reserve the right to edit, reject, or remove any comment that violates this policy. Repeated violations may result in a ban.</p>

            <h2 className="text-xl font-bold text-slate-900">8. Reporting</h2>
            <p>If you see a comment that violates this policy, please contact us immediately so we can review and take appropriate action.</p>

            <div className="bg-red-50 rounded-lg p-5 border border-red-100 mt-8">
              <p className="text-sm text-slate-600">
                By submitting a comment, you agree to abide by this policy. Thank you for helping us maintain a positive community.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
