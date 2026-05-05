import { NextResponse } from 'next/server';
import { getSupabaseAdmin, requireAdminKey } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const allowedStatuses = new Set([
  'uusi_liidi',
  'kontaktoitu',
  'esikarsinta',
  'katselmus_sovittu',
  'tarjous_lahetetty',
  'neuvottelu',
  'sopimus',
  'valmis_laskutettu',
  'hylatty',
]);

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!requireAdminKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const status = String(payload.status ?? '').trim();
    const notes = payload.notes === undefined ? undefined : String(payload.notes ?? '').trim();

    if (!allowedStatuses.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const update: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) update.notes = notes || null;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('leads')
      .update(update)
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ lead: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Tuntematon virhe.' }, { status: 500 });
  }
}
