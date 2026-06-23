'use client';
import { useEffect } from 'react';

export default function ViewTracker({ slug }) {
  useEffect(() => {
    fetch(`/api/news/slug/${slug}`, { method: 'PATCH' }).catch(() => {});
  }, [slug]);
  return null;
}
