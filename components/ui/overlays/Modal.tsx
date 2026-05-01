import { ReactNode } from 'react';
import { Button } from '@/components/ui/actions/Button';

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose?: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-eki-border bg-eki-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose}>Sulje</Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
