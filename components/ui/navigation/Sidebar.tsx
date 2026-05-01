import { ReactNode } from 'react';

export function Sidebar({ children }: { children: ReactNode }) {
  return <aside className="hidden w-64 shrink-0 border-r border-eki-border bg-zinc-900/50 p-4 lg:block">{children}</aside>;
}
