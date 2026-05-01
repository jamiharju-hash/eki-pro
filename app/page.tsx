import { AlertTriangle, Activity, RefreshCw } from 'lucide-react';
import { KpiCard } from '@/components/KpiCard';
import { getKpiHistory, getLatestKpi } from '@/lib/kpi-engine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function eur(value: number) {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function pct(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)} %`;
}

function MiniLine({ values }: { values: number[] }) {
  if (values.length === 0) return <div className="h-24 rounded-xl bg-zinc-800/60" />;

  const width = 420;
  const height = 110;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? width : (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full overflow-visible">
      <polyline points={points} fill="none" stroke="#B66E3F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function DashboardPage() {
  const [latest, history] = await Promise.all([getLatestKpi(), getKpiHistory(50)]);

  if (!latest) {
    return (
      <main className="min-h-screen bg-eki-background px-6 py-10 text-zinc-100">
        <section className="mx-auto max-w-7xl rounded-3xl border border-eki-border bg-eki-card p-8">
          <h1 className="text-3xl font-bold">EKI PRO Investment Dashboard</h1>
          <p className="mt-3 text-zinc-400">Tietokannassa ei ole vielä KPI-dataa.</p>
          <a href="/api/engine/update" className="mt-6 inline-flex rounded-xl bg-eki-copper px-5 py-3 font-semibold text-white">
            Käynnistä ensimmäinen päivitys
          </a>
        </section>
      </main>
    );
  }

  const navHistory = history.map((row) => row.nav);
  const isRiskLimited = latest.strategyMode === 'LIMITED';

  return (
    <main className="min-h-screen bg-eki-background px-4 py-6 text-zinc-100 md:px-8 md:py-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-eki-border bg-gradient-to-br from-eki-card to-zinc-900 p-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-eki-copper">
              <Activity size={18} /> EKI PRO
            </div>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">Investment Dashboard</h1>
            <p className="mt-2 text-zinc-400">CoinGecko + Neon Postgres + Next.js 14</p>
          </div>
          <div className="rounded-2xl border border-eki-border bg-black/20 px-5 py-4 text-sm text-zinc-400">
            <div>Viimeisin snapshot</div>
            <div className="mt-1 font-mono text-zinc-100">{new Date(latest.timestamp).toLocaleString('fi-FI')}</div>
          </div>
        </header>

        {isRiskLimited ? (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
            <AlertTriangle size={20} /> Riskitila LIMITED: CoinGecko-data on yli 30 minuuttia vanhaa tai osittain puuttuvaa.
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Kokonaisarvo NAV" value={eur(latest.nav)} subtitle="Salkun kokonaisarvo USD" large />
          <KpiCard title="Päivän tuotto %" value={pct(latest.dailyReturnPct)} tone={latest.dailyReturnPct >= 0 ? 'positive' : 'negative'} />
          <KpiCard title="Max Drawdown %" value={pct(latest.maxDrawdownPct)} tone={latest.maxDrawdownPct < -10 ? 'negative' : 'warning'} />
          <KpiCard title="Riskitila" value={latest.strategyMode} tone={isRiskLimited ? 'warning' : latest.strategyMode === 'OFF' ? 'negative' : 'positive'} />
          <KpiCard title="Core-osuus %" value={`${latest.corePct.toFixed(1)} %`} subtitle="Target 90 %" />
          <KpiCard title="Moonshot-osuus %" value={`${latest.moonshotPct.toFixed(1)} %`} subtitle="Target 10 %" />
          <KpiCard title="Vedonlyöntikassan osuus %" value={`${latest.bettingVaultPct.toFixed(1)} %`} />
          <KpiCard title="Suurin yksittäinen altcoin" value={latest.topAltcoinName} subtitle="Moonshot-korin suurin positio" />
          <KpiCard title="CLV Rolling 50" value={`${latest.clvRolling50.toFixed(2)} %`} />
          <KpiCard title="Betting Velocity" value={eur(latest.bettingVelocity)} subtitle="Päivän panoskierto" />
        </section>

        <section className="rounded-3xl border border-eki-border bg-eki-card p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">NAV-historia</h2>
              <p className="text-sm text-zinc-400">Viimeiset {history.length} snapshotia</p>
            </div>
            <a href="/api/engine/update" className="inline-flex items-center gap-2 rounded-xl border border-eki-border px-4 py-2 text-sm text-zinc-300 hover:border-eki-copper hover:text-white">
              <RefreshCw size={16} /> Päivitä
            </a>
          </div>
          <div className="mt-6">
            <MiniLine values={navHistory} />
          </div>
        </section>
      </section>
    </main>
  );
}
