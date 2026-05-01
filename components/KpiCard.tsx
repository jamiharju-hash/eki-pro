type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  tone?: 'neutral' | 'positive' | 'negative' | 'warning';
  large?: boolean;
};

const toneClasses = {
  neutral: 'text-zinc-100',
  positive: 'text-emerald-400',
  negative: 'text-red-400',
  warning: 'text-amber-300',
};

export function KpiCard({ title, value, subtitle, tone = 'neutral', large = false }: KpiCardProps) {
  return (
    <div className={`rounded-2xl border border-eki-border bg-eki-card p-5 shadow-xl ${large ? 'md:col-span-2 xl:col-span-2' : ''}`}>
      <div className="text-sm font-medium text-zinc-400">{title}</div>
      <div className={`mt-3 font-semibold tracking-tight ${large ? 'text-5xl' : 'text-3xl'} ${toneClasses[tone]}`}>{value}</div>
      {subtitle ? <div className="mt-2 text-sm text-zinc-500">{subtitle}</div> : null}
    </div>
  );
}
