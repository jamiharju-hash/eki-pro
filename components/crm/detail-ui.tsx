import { StatusBadge } from './module-ui';

export function DetailPageTemplate({
  title,
  subtitle,
  status,
  tabs,
  leftPaneTitle,
  rightPaneTitle,
}: {
  title: string;
  subtitle: string;
  status: { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info' };
  tabs: string[];
  leftPaneTitle: string;
  rightPaneTitle: string;
}) {
  return (
    <main className="min-h-screen bg-eki-background px-4 py-6 text-zinc-100 md:px-8 md:py-10">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-3xl border border-eki-border bg-eki-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
            </div>
            <StatusBadge label={status.label} tone={status.tone} />
          </div>
          <nav className="mt-5 flex flex-wrap gap-2 border-t border-zinc-700 pt-4">
            {tabs.map((tab, i) => (
              <button key={tab} className={`rounded-lg px-3 py-2 text-sm ${i === 0 ? 'bg-eki-copper text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                {tab}
              </button>
            ))}
          </nav>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-eki-border bg-eki-card p-5">
            <h2 className="text-lg font-semibold">{leftPaneTitle}</h2>
            <p className="mt-2 text-sm text-zinc-400">Primary data and timeline blocks.</p>
          </article>
          <article className="rounded-2xl border border-eki-border bg-eki-card p-5">
            <h2 className="text-lg font-semibold">{rightPaneTitle}</h2>
            <p className="mt-2 text-sm text-zinc-400">Linked records, notes, activities and audit trail.</p>
          </article>
        </section>
      </section>
    </main>
  );
}
