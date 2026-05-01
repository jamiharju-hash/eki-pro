import { NextResponse } from 'next/server';
import { updateKpis } from '@/lib/kpi-engine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const snapshot = await updateKpis();
    return NextResponse.json({ status: 'ok', snapshot });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('KPI update failed:', error);
    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
