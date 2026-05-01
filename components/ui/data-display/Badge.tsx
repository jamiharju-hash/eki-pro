import { cn } from '@/components/ui/foundation/cn';

type BadgeTone = 'neutral' | 'positive' | 'negative' | 'warning';
const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-zinc-700/70 text-zinc-100',
  positive: 'bg-emerald-500/20 text-emerald-300',
  negative: 'bg-red-500/20 text-red-300',
  warning: 'bg-amber-500/20 text-amber-300',
};

export function Badge({ tone = 'neutral', text }: { tone?: BadgeTone; text: string }) {
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', toneClasses[tone])}>{text}</span>;
}
