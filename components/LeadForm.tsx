'use client';

import { useState } from 'react';

type State = 'idle' | 'submitting' | 'success' | 'error';

export function LeadForm() {
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  async function submit(formData: FormData) {
    setState('submitting');
    setError('');

    const payload = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      area: formData.get('area'),
      projectType: formData.get('projectType'),
      budgetMin: formData.get('budgetMin'),
      budgetMax: formData.get('budgetMax'),
      timeline: formData.get('timeline'),
      message: formData.get('message'),
      source: 'website-mobile',
    };

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setState('error');
      setError(result.error ?? 'Lähetys epäonnistui. Soita suoraan, jos asia on kiireellinen.');
      return;
    }

    setState('success');
  }

  if (state === 'success') {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-50">
        <p className="text-lg font-semibold">Tarjouspyyntö vastaanotettu.</p>
        <p className="mt-2 text-sm text-emerald-100/80">EKI Rakennus ottaa yhteyttä. Kiireellisissä asioissa soita suoraan.</p>
        <a href="tel:+358406148111" className="mt-4 inline-flex min-h-12 items-center rounded-2xl bg-white px-5 font-semibold text-emerald-950">
          Soita Ekille
        </a>
      </div>
    );
  }

  return (
    <form action={submit} className="space-y-3 rounded-3xl border border-white/10 bg-white p-4 text-zinc-950 shadow-2xl md:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Tarjouspyyntö</p>
        <h2 className="mt-1 text-2xl font-black">Kerro työstä lyhyesti</h2>
        <p className="mt-1 text-sm text-zinc-600">Vastaus tavoite: alle 24 h.</p>
      </div>

      <label className="block text-sm font-semibold">
        Nimi
        <input name="name" required className="mt-1 h-12 w-full rounded-2xl border border-zinc-300 px-4 text-base" placeholder="Etunimi Sukunimi" />
      </label>

      <label className="block text-sm font-semibold">
        Puhelin
        <input name="phone" required inputMode="tel" className="mt-1 h-12 w-full rounded-2xl border border-zinc-300 px-4 text-base" placeholder="040 123 4567" />
      </label>

      <label className="block text-sm font-semibold">
        Sähköposti
        <input name="email" type="email" className="mt-1 h-12 w-full rounded-2xl border border-zinc-300 px-4 text-base" placeholder="nimi@email.fi" />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-semibold">
          Alue
          <select name="area" required className="mt-1 h-12 w-full rounded-2xl border border-zinc-300 px-4 text-base">
            <option value="Nummela">Nummela</option>
            <option value="Vihti">Vihti</option>
            <option value="Lohja">Lohja</option>
            <option value="Kirkkonummi">Kirkkonummi</option>
            <option value="Espoo">Espoo</option>
            <option value="Helsinki länsi">Helsinki länsi</option>
            <option value="Muu">Muu</option>
          </select>
        </label>

        <label className="block text-sm font-semibold">
          Työn tyyppi
          <select name="projectType" required className="mt-1 h-12 w-full rounded-2xl border border-zinc-300 px-4 text-base">
            <option value="Kylpyhuoneremontti">Kylpyhuoneremontti</option>
            <option value="Sauna + kylpyhuone">Sauna + kylpyhuone</option>
            <option value="Huoneistoremontti">Huoneistoremontti</option>
            <option value="Pintaremontti">Pintaremontti</option>
            <option value="Taloyhtiön märkätila">Taloyhtiön märkätila</option>
            <option value="Korjaus- tai huoltotyö">Korjaus- tai huoltotyö</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-semibold">
          Budjetti min
          <input name="budgetMin" inputMode="numeric" className="mt-1 h-12 w-full rounded-2xl border border-zinc-300 px-4 text-base" placeholder="8000" />
        </label>
        <label className="block text-sm font-semibold">
          Budjetti max
          <input name="budgetMax" inputMode="numeric" className="mt-1 h-12 w-full rounded-2xl border border-zinc-300 px-4 text-base" placeholder="18000" />
        </label>
      </div>

      <label className="block text-sm font-semibold">
        Aikataulu
        <select name="timeline" className="mt-1 h-12 w-full rounded-2xl border border-zinc-300 px-4 text-base">
          <option value="Heti kun mahdollista">Heti kun mahdollista</option>
          <option value="1-2 kuukauden sisällä">1–2 kuukauden sisällä</option>
          <option value="3+ kuukauden sisällä">3+ kuukauden sisällä</option>
          <option value="Ei kiirettä">Ei kiirettä</option>
        </select>
      </label>

      <label className="block text-sm font-semibold">
        Lisätiedot
        <textarea name="message" rows={4} className="mt-1 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-base" placeholder="Kohteen koko, osoite, nykytilanne, toivottu aloitus..." />
      </label>

      {state === 'error' ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

      <button disabled={state === 'submitting'} className="min-h-14 w-full rounded-2xl bg-zinc-950 px-5 text-base font-black text-white disabled:opacity-60">
        {state === 'submitting' ? 'Lähetetään…' : 'Lähetä tarjouspyyntö'}
      </button>
    </form>
  );
}
