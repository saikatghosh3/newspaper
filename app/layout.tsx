import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SettingsProvider } from '@/components/SettingsProvider';
import ReduxProvider from '@/components/ReduxProvider';
import ScrollToTop from '@/components/ScrollToTop';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DailyNews - Latest News & Updates',
  description: 'Your trusted source for the latest news, analysis, and updates.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <SettingsProvider>
            {children}
            <ScrollToTop />
            <Toaster richColors position="top-right" />
          </SettingsProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
