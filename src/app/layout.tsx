import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SoleVault | Premium Shoe Shopping App (i want a shobbing abb w)',
  description:
    'Curated performance running shoes, basketball sneakers, and grail streetwear silhouettes. Built with Next.js 14 App Router, Tailwind CSS, TypeScript, and MongoDB.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}