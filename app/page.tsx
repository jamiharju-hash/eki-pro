import { BriefcaseBusiness, ListTodo, RefreshCw, Rocket, TrendingUp } from 'lucide-react';
import { KpiCard } from '@/components/KpiCard';
import { getLatestKpi } from '@/lib/kpi-engine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function eur(value: number) {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DashboardPage() {
  const latest = await getLatestKpi();

  if (!latest) {
    return (
      <main className="min-h-screen bg-eki-background px-6 py-10 text-zinc-100">
        <section className="mx-auto max-w-7xl rounded-3xl border border-eki-border bg-eki-card p-8">
          <h1 className="text-3xl font-bold">EKI PRO CRM Dashboard</h1>
          <p className="mt-3 text-zinc-400">CRM-dataa ei ole vielä saatavilla.</p>
          <a href="/api/engine/update" className="mt-6 inline-flex rounded-xl bg-eki-copper px-5 py-3 font-semibold text-white">
            Synkronoi ensimmäinen CRM-päivitys
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-eki-background px-4 py-6 text-zinc-100 md:px-8 md:py-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-eki-border bg-gradient-to-br from-eki-card to-zinc-900 p-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-eki-copper">
              <BriefcaseBusiness size={18} /> EKI PRO CRM
            </div>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">CRM Dashboard</h1>
            <p className="mt-2 text-zinc-400">Myyntiputki, projektit ja aktiviteetit yhdessä näkymässä.</p>
          </div>
          <div className="rounded-2xl border border-eki-border bg-black/20 px-5 py-4 text-sm text-zinc-400">
            <div>Viimeisin CRM-snapshot</div>
            <div className="mt-1 font-mono text-zinc-100">{new Date(latest.timestamp).toLocaleString('fi-FI')}</div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <KpiCard title="Uudet liidit" value="42" subtitle="Viimeiset 30 päivää" href="/leads?filter=new" filterLabel="liidit: uudet" />
          <KpiCard title="Avoimet tarjoukset" value="18" subtitle="Käsittelyssä" href="/deals?status=open" filterLabel="tarjoukset: avoinna" />
          <KpiCard title="Konversio" value="31 %" tone="positive" subtitle="Liidi → asiakas" href="/analytics?metric=conversion" filterLabel="analytiikka: konversio" />
          <KpiCard title="Aktiiviset projektit" value="12" subtitle="Toimitus käynnissä" href="/projects?status=active" filterLabel="projektit: aktiiviset" />
          <KpiCard title="Laskutettava arvo" value={eur(286000)} tone="positive" subtitle="Avoin laskutusmassa" href="/billing?status=billable" filterLabel="laskutus: laskutettava" />
          <KpiCard title="Myynti 30 pv" value={eur(124000)} tone="positive" subtitle="Suljettu myynti" href="/sales?period=30d" filterLabel="myynti: 30 pv" />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-eki-border bg-eki-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pipeline Summary</h2>
              <a href="/deals" className="text-sm text-eki-copper hover:text-white">Avaa tarjoukset</a>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex items-center justify-between"><span>Discovery</span><span className="text-zinc-300">7 tarjousta</span></p>
              <p className="flex items-center justify-between"><span>Proposal</span><span className="text-zinc-300">6 tarjousta</span></p>
              <p className="flex items-center justify-between"><span>Negotiation</span><span className="text-zinc-300">5 tarjousta</span></p>
              <p className="flex items-center justify-between border-t border-eki-border pt-3 font-medium"><span>Weighted pipeline</span><span className="text-emerald-400">{eur(412000)}</span></p>
            </div>
          </article>

          <article className="rounded-3xl border border-eki-border bg-eki-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
              <ListTodo size={18} className="text-eki-copper" />
            </div>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li>Soita Nordline Oy: tarjouskatselmus klo 10:00</li>
              <li>Lähetä uusittu sopimus: Aurora Digital</li>
              <li>Valmistele demo: Polar Build -liidi</li>
              <li>Päivitä projektin kickoff-notes: Aava Systems</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-eki-border bg-eki-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <RefreshCw size={18} className="text-eki-copper" />
            </div>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li>Uusi liidi lisätty: Helmi Tech</li>
              <li>Tarjous hyväksytty: Solmu Consulting ({eur(32000)})</li>
              <li>Asiakastapaaminen kirjattu: Kallio Media</li>
              <li>Seurantatehtävä luotu: Tunturi Logistics</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-eki-border bg-eki-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Projects</h2>
              <Rocket size={18} className="text-eki-copper" />
            </div>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li>Arctic ERP rollout — 78 % valmiina</li>
              <li>RevOps audit — 52 % valmiina</li>
              <li>CRM migraatio — 64 % valmiina</li>
              <li>Asiakaspalvelun automaatio — 41 % valmiina</li>
            </ul>
          </article>
        </section>

        <section className="rounded-3xl border border-eki-border bg-eki-card p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <TrendingUp size={18} className="text-eki-copper" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/leads/new" className="rounded-xl border border-eki-border px-4 py-2 text-sm text-zinc-300 hover:border-eki-copper hover:text-white">+ Lisää liidi</a>
            <a href="/deals/new" className="rounded-xl border border-eki-border px-4 py-2 text-sm text-zinc-300 hover:border-eki-copper hover:text-white">+ Luo tarjous</a>
            <a href="/projects/new" className="rounded-xl border border-eki-border px-4 py-2 text-sm text-zinc-300 hover:border-eki-copper hover:text-white">+ Perusta projekti</a>
            <a href="/reports/sales" className="rounded-xl border border-eki-border px-4 py-2 text-sm text-zinc-300 hover:border-eki-copper hover:text-white">Avaa myyntiraportti</a>
          </div>
        </section>
      </section>
    </main>
  );
}
