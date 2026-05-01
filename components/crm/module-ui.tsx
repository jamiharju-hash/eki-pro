import Link from 'next/link';

type Cta = { label: string; href: string; kind?: 'primary' | 'secondary' };

type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const statusToneMap: Record<StatusTone, string> = {
  neutral: 'bg-zinc-700/60 text-zinc-200 border-zinc-600/80',
  success: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/50',
  warning: 'bg-amber-500/15 text-amber-100 border-amber-400/50',
  danger: 'bg-rose-500/15 text-rose-100 border-rose-400/50',
  info: 'bg-sky-500/15 text-sky-100 border-sky-400/50',
};

export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusToneMap[tone]}`}>{label}</span>;
}

export function ModulePageTemplate({
  title,
  description,
  primaryCta,
  secondaryCtas,
  filters,
  tableTitle,
  emptyTitle,
  emptyDescription,
  columns,
}: {
  title: string;
  description: string;
  primaryCta: Cta;
  secondaryCtas?: Cta[];
  filters: string[];
  tableTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  columns: string[];
}) {
  const safeSecondary = (secondaryCtas ?? []).slice(0, 2);

  return (
    <main className="min-h-screen bg-eki-background px-4 py-6 text-zinc-100 md:px-8 md:py-10">
      <section className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-eki-border bg-eki-card p-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-2 text-sm text-zinc-400">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {safeSecondary.map((cta) => (
              <Link key={cta.label} href={cta.href} className="rounded-xl border border-eki-border px-4 py-2 text-sm text-zinc-200 hover:border-eki-copper">
                {cta.label}
              </Link>
            ))}
            <Link href={primaryCta.href} className="rounded-xl bg-eki-copper px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              {primaryCta.label}
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-eki-border bg-eki-card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Filter Bar</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button key={filter} className="rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-sm text-zinc-300">
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-eki-border bg-eki-card p-4">
            <h2 className="text-lg font-semibold">{tableTitle}</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-700">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-zinc-800/80 text-left text-zinc-300">
                  <tr>
                    {columns.map((column) => (
                      <th key={column} className="px-3 py-2 font-semibold">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={columns.length} className="px-3 py-8 text-center text-zinc-500">No data yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-2xl border border-eki-border bg-eki-card p-5">
            <h3 className="text-lg font-semibold">Empty State</h3>
            <p className="mt-2 font-medium">{emptyTitle}</p>
            <p className="mt-1 text-sm text-zinc-400">{emptyDescription}</p>
            <div className="mt-4">
              <StatusBadge label="Draft" tone="neutral" />
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
