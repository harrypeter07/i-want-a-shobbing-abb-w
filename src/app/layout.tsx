import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'i want a  shobbing abb w',
  description: 'Built with Autonomous Remote AI Studio',
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