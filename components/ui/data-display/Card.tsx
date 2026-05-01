import { ReactNode } from 'react';
import { cn } from '@/components/ui/foundation/cn';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('rounded-2xl border border-eki-border bg-eki-card p-5 shadow-xl', className)}>{children}</section>;
}
