import { NextResponse } from 'next/server';
import { getSupabaseAdmin, requireAdminKey } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type OfferRow = {
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
};

type OfferPayload = {
  leadId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  worksiteAddress?: string;
  description?: string;
  rows?: OfferRow[];
  materialsTotal?: number;
  laborTotal?: number;
  subcontractingTotal?: number;
};

function n(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function t(value: unknown) {
  return String(value ?? '').trim();
}

function offerNumber() {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 10).replaceAll('-', '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EKI-${stamp}-${rand}`;
}

export async function POST(request: Request) {
  try {
    if (!requireAdminKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await request.json()) as OfferPayload;
    const rows = Array.isArray(payload.rows) ? payload.rows : [];
    const cleanRows = rows
      .map((row) => ({
        description: t(row.description),
        unit: t(row.unit) || 'kpl',
        quantity: n(row.quantity),
        unitPrice: n(row.unitPrice),
        total: n(row.quantity) * n(row.unitPrice),
      }))
      .filter((row) => row.description && row.quantity > 0);

    const rowTotal = cleanRows.reduce((sum, row) => sum + row.total, 0);
    const materialsTotal = n(payload.materialsTotal);
    const laborTotal = n(payload.laborTotal);
    const subcontractingTotal = n(payload.subcontractingTotal);
    const subtotal = rowTotal + materialsTotal + laborTotal + subcontractingTotal;
    const vatRate = 25.5;
    const vatTotal = subtotal * (vatRate / 100);
    const total = subtotal + vatTotal;

    const customerName = t(payload.customerName);
    if (!customerName) {
      return NextResponse.json({ error: 'Asiakkaan nimi vaaditaan.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('offers')
      .insert({
        offer_number: offerNumber(),
        lead_id: payload.leadId || null,
        customer_name: customerName,
        customer_phone: t(payload.customerPhone) || null,
        customer_email: t(payload.customerEmail) || null,
        worksite_address: t(payload.worksiteAddress) || null,
        description: t(payload.description) || null,
        rows: cleanRows,
        materials_total: materialsTotal,
        labor_total: laborTotal,
        subcontracting_total: subcontractingTotal,
        subtotal,
        vat_rate: vatRate,
        vat_total: vatTotal,
        total,
      })
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ offer: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Tuntematon virhe.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    if (!requireAdminKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ offers: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Tuntematon virhe.' }, { status: 500 });
  }
}
