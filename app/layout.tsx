import type { Metadata } from 'next';
import CrmShell from '@/components/layout/CrmShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'EKI PRO Investment Dashboard',
  description: 'Crypto portfolio and betting KPI monitoring dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi" className="dark">
      <body>
        <CrmShell>{children}</CrmShell>
      </body>
    </html>
  );
}
