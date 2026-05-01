import { NextResponse } from 'next/server';
import { getKpiHistory, getLatestKpi } from '@/lib/kpi-engine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const [latest, history] = await Promise.all([getLatestKpi(), getKpiHistory(50)]);
    return NextResponse.json({ latest, history });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}
