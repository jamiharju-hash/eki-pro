import { AlertTriangle, Activity, RefreshCw } from 'lucide-react';
import { KpiCard } from '@/components/KpiCard';
import { getKpiHistory, getLatestKpi } from '@/lib/kpi-engine';
import { Sidebar } from '@/components/ui/navigation/Sidebar';
import { TopBar } from '@/components/ui/navigation/TopBar';
import { Button } from '@/components/ui/actions/Button';
import { Card } from '@/components/ui/data-display/Card';
import { Table } from '@/components/ui/data-display/Table';
import { Badge } from '@/components/ui/data-display/Badge';
import { Modal } from '@/components/ui/overlays/Modal';
import { Input } from '@/components/ui/inputs/Input';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function eur(value: number) { return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value); }
function pct(value: number) { return `${value >= 0 ? '+' : ''}${value.toFixed(2)} %`; }

function MiniLine({ values }: { values: number[] }) {
  if (values.length === 0) return <div className="h-24 rounded-xl bg-zinc-800/60" />;
  const width = 420; const height = 110; const min = Math.min(...values); const max = Math.max(...values); const range = max - min || 1;
  const points = values.map((value, index) => `${values.length === 1 ? width : (index / (values.length - 1)) * width},${height - ((value - min) / range) * height}`).join(' ');
  return <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full overflow-visible"><polyline points={points} fill="none" stroke="#B66E3F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default async function DashboardPage() {
  const [latest, history] = await Promise.all([getLatestKpi(), getKpiHistory(50)]);
  if (!latest) return <main className="min-h-screen bg-eki-background p-8 text-zinc-100"><Card><h1 className="text-3xl font-bold">EKI PRO Investment Dashboard</h1><p className="mt-3 text-zinc-400">Tietokannassa ei ole vielä KPI-dataa.</p><a href="/api/engine/update" className="mt-6 inline-flex"><Button>Käynnistä ensimmäinen päivitys</Button></a></Card></main>;

  const navHistory = history.map((row) => row.nav); const isRiskLimited = latest.strategyMode === 'LIMITED';
  const rows = history.slice(0, 8).map((item) => [new Date(item.timestamp).toLocaleString('fi-FI'), eur(item.nav), pct(item.dailyReturnPct)]);

  return (
    <main className="min-h-screen bg-eki-background text-zinc-100">
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-eki-copper"><Activity size={16} /> EKI PRO</div>
          <nav className="mt-6 space-y-2 text-sm text-zinc-300"><div className="rounded-lg bg-zinc-800/70 px-3 py-2">Dashboard</div><div className="px-3 py-2">Portfolio</div></nav>
        </Sidebar>
        <section className="flex-1 space-y-6 p-4 md:p-8">
          <TopBar title="Investment Dashboard" actions={<div className="flex items-center gap-2"><a href="/api/engine/update"><Button variant="secondary"><span className="inline-flex items-center gap-2"><RefreshCw size={16} /> Päivitä</span></Button></a><Button variant="ghost" disabled>Export</Button></div>} />
          {isRiskLimited ? <Card className="border-amber-500/30 bg-amber-500/10 text-amber-200"><div className="flex items-center gap-3"><AlertTriangle size={20} /> Riskitila LIMITED: CoinGecko-data on yli 30 minuuttia vanhaa tai osittain puuttuvaa.</div></Card> : null}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard title="Kokonaisarvo NAV" value={eur(latest.nav)} subtitle="Salkun kokonaisarvo USD" large />
            <KpiCard title="Päivän tuotto %" value={pct(latest.dailyReturnPct)} tone={latest.dailyReturnPct >= 0 ? 'positive' : 'negative'} />
            <KpiCard title="Max Drawdown %" value={pct(latest.maxDrawdownPct)} tone={latest.maxDrawdownPct < -10 ? 'negative' : 'warning'} />
            <KpiCard title="Riskitila" value={latest.strategyMode} tone={isRiskLimited ? 'warning' : latest.strategyMode === 'OFF' ? 'negative' : 'positive'} />
          </section>

          <Card>
            <div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">NAV-historia</h2><p className="text-sm text-zinc-400">Viimeiset {history.length} snapshotia</p></div><Badge tone={isRiskLimited ? 'warning' : 'positive'} text={latest.strategyMode} /></div>
            <div className="mt-6"><MiniLine values={navHistory} /></div>
          </Card>

          <Card className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2"><Input label="Suodata" placeholder="Hae snapshotteja" /><Input label="Virhe-esimerkki" error="Pakollinen kenttä" defaultValue="" /></div>
            <Table headers={['Aika', 'NAV', 'Päivä']} rows={rows} />
          </Card>
        </section>
      </div>
      <Modal open={false} title="Demo modal"><p>Modal sisältö</p></Modal>
    </main>
  );
}
