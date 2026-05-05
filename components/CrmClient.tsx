'use client';

import { useMemo, useState } from 'react';
import { RefreshCw, Star } from 'lucide-react';

type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  area: string;
  project_type: string;
  budget_min: number | null;
  budget_max: number | null;
  timeline: string | null;
  message: string | null;
  status: string;
  score: number;
  golden_job: boolean;
  notes: string | null;
};

const statuses = [
  ['uusi_liidi', 'Uusi'],
  ['kontaktoitu', 'Kontaktoitu'],
  ['esikarsinta', 'Esikarsinta'],
  ['katselmus_sovittu', 'Katselmus'],
  ['tarjous_lahetetty', 'Tarjous'],
  ['neuvottelu', 'Neuvottelu'],
  ['sopimus', 'Sopimus'],
  ['valmis_laskutettu', 'Valmis'],
  ['hylatty', 'Hylätty'],
];

function eur(value: number | null) {
  if (!value) return '—';
  return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

export function CrmClient() {
  const [adminKey, setAdminKey] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const metrics = useMemo(() => {
    const open = leads.filter((lead) => !['valmis_laskutettu', 'hylatty'].includes(lead.status));
    const pipeline = open.reduce((sum, lead) => sum + Number(lead.budget_max ?? lead.budget_min ?? 0), 0);
    const golden = open.filter((lead) => lead.golden_job).length;
    const avgScore = open.length ? Math.round(open.reduce((sum, lead) => sum + lead.score, 0) / open.length) : 0;
    return { open: open.length, pipeline, golden, avgScore };
  }, [leads]);

  async function loadLeads() {
    setLoading(true);
    setError('');
    const response = await fetch('/api/leads', { headers: { 'x-eki-admin-key': adminKey } });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? 'CRM-lataus epäonnistui.');
      return;
    }

    setLeads(result.leads ?? []);
  }

  async function updateStatus(id: string, status: string) {
    const response = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-eki-admin-key': adminKey },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      setLeads((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-5 text-white md:px-8">
      <section className="mx-auto max-w-6xl space-y-5">
        <header className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">EKI Pro CRM</p>
          <h1 className="text-3xl font-black md:text-5xl">Liidit ja myyntiputki</h1>
          <div className="grid gap-2 md:grid-cols-[1fr_auto]">
            <input
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              type="password"
              placeholder="EKI_ADMIN_KEY"
              className="h-12 rounded-2xl border border-white/10 bg-zinc-900 px-4 text-base outline-none focus:border-orange-400"
            />
            <button onClick={loadLeads} disabled={loading || !adminKey} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 font-black disabled:opacity-50">
              <RefreshCw size={18} /> {loading ? 'Ladataan…' : 'Lataa CRM'}
            </button>
          </div>
          {error ? <p className="rounded-2xl bg-red-500/10 p-3 text-sm font-semibold text-red-200">{error}</p> : null}
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-zinc-400">Avoimet</p><p className="text-2xl font-black">{metrics.open}</p></div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-zinc-400">Putki</p><p className="text-2xl font-black">{eur(metrics.pipeline)}</p></div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-zinc-400">Kultaiset</p><p className="text-2xl font-black">{metrics.golden}</p></div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-zinc-400">Score ka.</p><p className="text-2xl font-black">{metrics.avgScore}</p></div>
        </section>

        <section className="space-y-3">
          {leads.map((lead) => (
            <article key={lead.id} className="rounded-3xl border border-white/10 bg-white p-4 text-zinc-950 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black">{lead.name}</h2>
                    {lead.golden_job ? <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-black text-orange-700"><Star size={13} /> Kultainen</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">{lead.project_type} · {lead.area} · {eur(lead.budget_max ?? lead.budget_min)}</p>
                  <p className="mt-1 text-sm text-zinc-600">{new Date(lead.created_at).toLocaleString('fi-FI')}</p>
                </div>
                <div className="rounded-2xl bg-zinc-950 px-3 py-2 text-center text-white"><p className="text-xs text-zinc-400">Score</p><p className="font-black">{lead.score}</p></div>
              </div>

              <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
                <a className="rounded-2xl bg-zinc-100 p-3 font-bold" href={`tel:${lead.phone}`}>{lead.phone}</a>
                {lead.email ? <a className="rounded-2xl bg-zinc-100 p-3 font-bold" href={`mailto:${lead.email}`}>{lead.email}</a> : <div className="rounded-2xl bg-zinc-100 p-3 text-zinc-500">Ei sähköpostia</div>}
                <div className="rounded-2xl bg-zinc-100 p-3">{lead.timeline ?? 'Aikataulu avoin'}</div>
              </div>

              {lead.message ? <p className="mt-3 rounded-2xl bg-zinc-50 p-3 text-sm text-zinc-700">{lead.message}</p> : null}

              <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
                <select value={lead.status} onChange={(event) => updateStatus(lead.id, event.target.value)} className="h-12 rounded-2xl border border-zinc-300 px-3 font-bold">
                  {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <a href={`/tarjous?leadId=${lead.id}&name=${encodeURIComponent(lead.name)}&phone=${encodeURIComponent(lead.phone)}&email=${encodeURIComponent(lead.email ?? '')}`} className="flex min-h-12 items-center justify-center rounded-2xl bg-orange-600 px-5 font-black text-white">
                  Tee tarjous
                </a>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
