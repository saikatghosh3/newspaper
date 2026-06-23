'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NewsletterPage() {
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  async function handleSubscribe(e) {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar categories={categories} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-2">Newsletter</h1>
          <p className="text-lg text-red-600 font-semibold mb-8">Stay informed with DailyNews.</p>

          <div className="space-y-5 text-slate-700 leading-relaxed">
            <p>Subscribe to our newsletter and never miss important news. Get the top stories delivered straight to your inbox every morning.</p>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 border border-red-100 my-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Subscribe Now</h2>
              <p className="text-slate-600 mb-6">Join thousands of readers who start their day with DailyNews.</p>

              {subscribed ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-center">
                  <p className="text-green-700 font-semibold">Thank you for subscribing! Check your inbox for confirmation.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-8">What You Get</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span><strong>Daily Briefing:</strong> Top headlines curated by our editors every morning.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span><strong>Breaking News:</strong> Instant alerts for important developing stories.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span><strong>Exclusive Content:</strong> Special reports and in-depth analysis delivered to subscribers.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span><strong>No Spam:</strong> We respect your inbox. Unsubscribe anytime with one click.</span>
              </li>
            </ul>

            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 mt-8">
              <p className="text-sm text-slate-500">
                Your email address will only be used for sending our newsletter. You can unsubscribe at any time. We never share your information with third parties. Read our <Link href="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
