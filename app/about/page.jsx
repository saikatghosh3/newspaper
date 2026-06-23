'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const en = {
  title: 'About Us',
  subtitle: 'Your Trusted Source for News',
  para1: 'DailyNews is a leading digital news platform committed to delivering accurate, timely, and unbiased news coverage. Our team of dedicated journalists works around the clock to bring you the latest updates from around the world.',
  para2: 'Founded with a mission to inform and empower readers, we cover a wide range of topics including politics, business, technology, sports, entertainment, and more. Our content is carefully curated to ensure reliability and depth.',
  para3: 'We believe in the power of journalism to drive positive change. Every story we publish undergoes rigorous fact-checking and editorial review to maintain the highest standards of integrity.',
  para4: 'Thank you for trusting DailyNews as your source for news. We are committed to serving you with excellence every day.',
  mission: 'Our Mission',
  missionText: 'To provide accessible, high-quality journalism that informs public discourse and empowers individuals to make informed decisions.',
  vision: 'Our Vision',
  visionText: 'To be the most trusted digital news platform, setting the standard for journalistic excellence in the digital age.',
};

export default function AboutPage() {
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
          <p className="text-lg text-red-600 font-semibold mb-8">{t.subtitle}</p>

          <div className="space-y-5 text-slate-700 leading-relaxed">
            <p>{t.para1}</p>
            <p>{t.para2}</p>
            <p>{t.para3}</p>
            <p>{t.para4}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="bg-red-50 rounded-lg p-6 border border-red-100">
              <h2 className="text-lg font-bold text-slate-900 mb-2">{t.mission}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{t.missionText}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-slate-900 mb-2">{t.vision}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{t.visionText}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
