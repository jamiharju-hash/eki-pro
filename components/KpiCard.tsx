type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  tone?: 'neutral' | 'positive' | 'negative' | 'warning';
  large?: boolean;
  href?: string;
  filterLabel?: string;
};

const toneClasses = {
  neutral: 'text-zinc-100',
  positive: 'text-emerald-400',
  negative: 'text-red-400',
  warning: 'text-amber-300',
};

export function KpiCard({ title, value, subtitle, tone = 'neutral', large = false, href, filterLabel }: KpiCardProps) {
  const card = (
    <div
      className={`rounded-2xl border border-eki-border bg-eki-card p-5 shadow-xl transition ${
        href ? 'hover:border-eki-copper hover:bg-zinc-900/80 hover:shadow-2xl' : ''
      } ${large ? 'md:col-span-2 xl:col-span-2' : ''}`}
    >
      <div className="text-sm font-medium text-zinc-400">{title}</div>
      <div className={`mt-3 font-semibold tracking-tight ${large ? 'text-5xl' : 'text-3xl'} ${toneClasses[tone]}`}>{value}</div>
      {subtitle ? <div className="mt-2 text-sm text-zinc-500">{subtitle}</div> : null}
      {href && filterLabel ? <div className="mt-3 text-xs font-medium uppercase tracking-wide text-eki-copper">Avaa: {filterLabel}</div> : null}
    </div>
  );

  if (!href) return card;

  return (
    <a href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eki-copper/70 focus-visible:ring-offset-2 focus-visible:ring-offset-eki-background">
      {card}
    </a>
  );
}
