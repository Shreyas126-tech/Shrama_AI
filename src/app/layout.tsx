import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SHRAMA SATHI AI | श्रम साथी AI - Indian Worker Rights & Voice Companion',
  description: 'Multilingual AI voice assistant, statutory wage calculator, welfare scheme directory, and grievance redressal for Indian workers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}

