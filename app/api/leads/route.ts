import { NextResponse } from 'next/server';
import { getSupabaseAdmin, requireAdminKey } from '@/lib/supabase/server';
import { scoreLead } from '@/lib/lead-scoring';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  area?: string;
  projectType?: string;
  budgetMin?: number | string;
  budgetMax?: number | string;
  timeline?: string;
  message?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

function numberOrNull(value: unknown) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function cleanText(value: unknown) {
  return String(value ?? '').trim();
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;
    const name = cleanText(payload.name);
    const phone = cleanText(payload.phone);
    const area = cleanText(payload.area);
    const projectType = cleanText(payload.projectType);

    if (!name || !phone || !area || !projectType) {
      return NextResponse.json({ error: 'Nimi, puhelin, alue ja remonttityyppi vaaditaan.' }, { status: 400 });
    }

    const budgetMin = numberOrNull(payload.budgetMin);
    const budgetMax = numberOrNull(payload.budgetMax);
    const scoring = scoreLead({ area, projectType, budgetMin, budgetMax, timeline: payload.timeline });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name,
        phone,
        email: cleanText(payload.email) || null,
        area,
        project_type: projectType,
        budget_min: budgetMin,
        budget_max: budgetMax,
        timeline: cleanText(payload.timeline) || null,
        message: cleanText(payload.message) || null,
        source: cleanText(payload.source) || 'website',
        utm_source: cleanText(payload.utmSource) || null,
        utm_medium: cleanText(payload.utmMedium) || null,
        utm_campaign: cleanText(payload.utmCampaign) || null,
        score: scoring.score,
        golden_job: scoring.goldenJob,
      })
      .select('id, score, golden_job')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, lead: data }, { status: 201 });
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
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ leads: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Tuntematon virhe.' }, { status: 500 });
  }
}
