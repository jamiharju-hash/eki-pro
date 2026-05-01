import { ReactNode } from 'react';

export function TopBar({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl border border-eki-border bg-eki-card p-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      {actions}
    </header>
  );
}
