import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SHRAMA SATHI AI | श्रम साथी AI — Indian Worker Rights & AI Voice Companion',
  description: 'Multilingual AI voice assistant with Gnani Timbre v3.0, statutory wage calculator (Section 14 2× overtime), welfare scheme directory, and grievance redressal for 500M+ Indian workers.',
  keywords: ['Indian workers', 'labour law', 'minimum wage', 'e-shram', 'worker rights', 'AI assistant', 'Hindi voice', 'shrama sathi'],
  authors: [{ name: 'SHRAMA SATHI AI' }],
  openGraph: {
    title: 'SHRAMA SATHI AI — हर भारतीय श्रमिक का सच्चा डिजिटल साथी',
    description: 'AI-powered multilingual voice assistant for Indian worker rights, wages, welfare schemes and grievance redressal.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ea580c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

