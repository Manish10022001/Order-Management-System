import type { Metadata } from 'next';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'OSM',
  description: 'Multi-store order management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f4f4f2] min-h-screen">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}