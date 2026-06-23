'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const en = {
  title: 'Contact Us',
  subtitle: 'We would love to hear from you.',
  intro: 'Have a question, feedback, or story tip? Get in touch with us. Our team is always ready to assist you.',
  name: 'Your Name',
  email: 'Your Email',
  subject: 'Subject',
  message: 'Your Message',
  submit: 'Send Message',
  sent: 'Thank you! Your message has been sent successfully.',
  or: 'Or reach us directly:',
  address: '123 News Street, Media City, NY 10001',
  phone: '+1 (555) 123-4567',
  mail: 'contact@dailynews.com',
  placeholderName: 'Enter your name',
  placeholderEmail: 'Enter your email',
  placeholderSubject: 'What is this about?',
  placeholderMessage: 'Write your message here...',
};

export default function ContactPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  const t = en;

  async function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
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
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-2">{t.title}</h1>
          <p className="text-lg text-red-600 font-semibold mb-4">{t.subtitle}</p>
          <p className="text-slate-600 mb-8">{t.intro}</p>

          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-700 font-semibold text-lg">{t.sent}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t.placeholderName} required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800" />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder={t.placeholderEmail} required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800" />
              </div>
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder={t.placeholderSubject} required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800" />
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={t.placeholderMessage} rows={5} required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800 resize-none" />
              <button type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                {t.submit}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="font-semibold text-slate-700 mb-4">{t.or}</p>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>{t.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:contact@dailynews.com" className="text-red-600 hover:underline">{t.mail}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
