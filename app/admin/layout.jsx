'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const isLoginPage = pathname?.startsWith('/admin/login');

  useEffect(() => {
    if (isLoginPage) {
      setReady(true);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      const stored = localStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === 'reporter') {
        const permissions = user.permissions || {};
        const allowed =
          pathname === '/admin/news' ||
          (pathname?.startsWith('/admin/news/create') && permissions.canCreateNews) ||
          (pathname?.startsWith('/admin/news/edit') && permissions.canEditNews) ||
          pathname === '/admin/videos' ||
          (pathname?.startsWith('/admin/videos/create') && permissions.canUploadVideos) ||
          (pathname?.startsWith('/admin/videos/edit') && permissions.canEditVideos);

        if (!allowed) {
          const fallback = permissions.canCreateNews ? '/admin/news/create' : permissions.canUploadVideos ? '/admin/videos/create' : '/admin/news';
          router.replace(fallback);
          return;
        }
      }
      setReady(true);
    }
  }, [isLoginPage, pathname, router]);

  useEffect(() => { setMobileSidebar(false); }, [pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>

      {mobileSidebar && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebar(false)} />
          <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
            <AdminSidebar mobile onClose={() => setMobileSidebar(false)} />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center gap-2 p-3 border-b border-slate-200 bg-white">
          <button
            onClick={() => setMobileSidebar(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-slate-800">DailyNews CMS</span>
        </div>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
