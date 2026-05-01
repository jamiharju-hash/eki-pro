import type { VercelRequest, VercelResponse } from '@vercel/node';
import { updateKpis } from '../engine/update_kpis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const snapshot = await updateKpis();

    return res.status(200).json({
      status: 'ok',
      created_at: snapshot.created_at,
      nav: snapshot.nav,
      daily_pct: snapshot.daily_pct,
      max_drawdown_pct: snapshot.max_drawdown_pct,
      strategy_mode: snapshot.strategy_mode,
      data_is_stale: snapshot.data_is_stale,
      stale_coin_ids: snapshot.stale_coin_ids,
      core_ratio: snapshot.core_ratio,
      moonshot_ratio: snapshot.moonshot_ratio,
      largest_altcoin_id: snapshot.largest_altcoin_id,
      largest_altcoin_pct: snapshot.largest_altcoin_pct,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('update-kpis failed:', error);

    return res.status(500).json({
      status: 'error',
      error: message,
    });
  }
}
