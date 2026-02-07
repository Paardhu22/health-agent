// Root Layout
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/ui/SmoothScroll';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Health Agent - Your Personal AI Health Assistant',
  description: 'Personalized health recommendations powered by AI. Get diet plans, exercise routines, yoga recommendations, and book doctor appointments.',
  keywords: ['health', 'wellness', 'AI', 'diet', 'exercise', 'yoga', 'doctor appointments'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
