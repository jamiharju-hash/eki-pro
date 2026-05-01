import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EKI PRO Investment Dashboard',
  description: 'Crypto portfolio and betting KPI monitoring dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi" className="dark">
      <body>{children}</body>
    </html>
  );
}
