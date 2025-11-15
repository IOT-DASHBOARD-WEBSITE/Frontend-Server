import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.scss';
import Navbar from '@/shared/components/Navbar';
import { DeviceProvider } from '@/shared/contexts/DeviceContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IoT Control System',
  description: 'Real-time IoT device monitoring and control dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased layout-with-sidebar`}
      >
        <DeviceProvider>
          <Navbar />
          <main className="layout-main">
            {children}
          </main>
        </DeviceProvider>
      </body>
    </html>
  );
}
