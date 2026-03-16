import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Synthwave SV-1',
  description: 'Web-based polyphonic synthesizer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @keyframes ledPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.55; }
          }
          @keyframes noteFlicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.94; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
