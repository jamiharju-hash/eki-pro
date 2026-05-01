import 'dotenv/config';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

const CORE_IDS = ['bitcoin', 'ethereum'] as const;

const MOONSHOT_IDS = [
  'autonolas',
  'aethir',
  'nosana',
  'fluence',
  'clearpool',
  'maple',
  'goldfinch',
  'paal-ai',
  '0x0-ai-smart-contract',
] as const;

const ALL_COIN_IDS = [...CORE_IDS, ...MOONSHOT_IDS] as const;

type StrategyMode = 'ON' | 'LIMITED' | 'OFF';
type Bucket = 'CORE' | 'MOONSHOT';

type PricePayload = Record<
  string,
  {
    usd?: number;
    usd_24h_change?: number;
    usd_24h_vol?: number;
    usd_market_cap?: number;
    last_updated_at?: number;
  }
>;

type Holding = {
  coin_id: string;
  balance: number;
  bucket: Bucket;
};

type KpiSnapshot = {
  created_at: string;
  nav: number;
  daily_pct: number;
  max_drawdown_pct: number;
  strategy_mode: StrategyMode;
  core_value: number;
  moonshot_value: number;
  core_ratio: number;
  moonshot_ratio: number;
  target_core_ratio: number;
  target_moonshot_ratio: number;
  core_ratio_deviation: number;
  moonshot_ratio_deviation: number;
  betting_vault_ratio: number;
  largest_altcoin_id: string | null;
  largest_altcoin_pct: number;
  clv_rolling_50: number | null;
  betting_velocity: number;
  raw_prices: PricePayload;
  holdings_snapshot: Array<Holding & { price: number; value: number }>;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function numericEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric environment variable ${name}: ${value}`);
  }

  return parsed;
}

function strategyMode(): StrategyMode {
  const value = process.env.STRATEGY_MODE ?? 'OFF';
  if (value === 'ON' || value === 'LIMITED' || value === 'OFF') return value;
  throw new Error(`Invalid STRATEGY_MODE: ${value}`);
}

async function fetchCoinGeckoPrices(): Promise<PricePayload> {
  const params = new URLSearchParams({
    ids: ALL_COIN_IDS.join(','),
    vs_currencies: 'usd',
    include_market_cap: 'true',
    include_24hr_vol: 'true',
    include_24hr_change: 'true',
    include_last_updated_at: 'true',
  });

  const response = await fetch(`${COINGECKO_BASE_URL}/simple/price?${params}`, {
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': requiredEnv('CG_API_KEY'),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`CoinGecko request failed: ${response.status} ${body}`);
  }

  return response.json() as Promise<PricePayload>;
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const supabaseUrl = requiredEnv('SUPABASE_URL').replace(/\/$/, '');
  const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${body}`);
  }

  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

async function fetchHoldings(): Promise<Holding[]> {
  const coinFilter = `(${ALL_COIN_IDS.map((id) => `"${id}"`).join(',')})`;
  const rows = await supabaseRequest<Array<{ coin_id: string; balance: string | number; bucket: Bucket }>>(
    `portfolio_holdings?select=coin_id,balance,bucket&coin_id=in.${encodeURIComponent(coinFilter)}`,
  );

  return rows.map((row) => ({
    coin_id: row.coin_id,
    balance: Number(row.balance),
    bucket: row.bucket,
  }));
}

async function fetchYesterdayNav(): Promise<number | null> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const rows = await supabaseRequest<Array<{ nav: string | number }>>(
    `kpi_snapshots?select=nav&created_at=lte.${encodeURIComponent(cutoff)}&order=created_at.desc&limit=1`,
  );

  return rows[0]?.nav === undefined ? null : Number(rows[0].nav);
}

async function fetchAllTimeHighNav(): Promise<number | null> {
  const rows = await supabaseRequest<Array<{ nav: string | number }>>(
    'kpi_snapshots?select=nav&order=nav.desc&limit=1',
  );

  return rows[0]?.nav === undefined ? null : Number(rows[0].nav);
}

function calculateSnapshot(params: {
  prices: PricePayload;
  holdings: Holding[];
  yesterdayNav: number | null;
  allTimeHighNav: number | null;
}): KpiSnapshot {
  const { prices, holdings, yesterdayNav, allTimeHighNav } = params;

  const holdingsSnapshot = holdings.map((holding) => {
    const price = prices[holding.coin_id]?.usd ?? 0;
    return {
      ...holding,
      price,
      value: holding.balance * price,
    };
  });

  const nav = holdingsSnapshot.reduce((sum, row) => sum + row.value, 0);
  const coreValue = holdingsSnapshot
    .filter((row) => row.bucket === 'CORE')
    .reduce((sum, row) => sum + row.value, 0);
  const moonshotValue = holdingsSnapshot
    .filter((row) => row.bucket === 'MOONSHOT')
    .reduce((sum, row) => sum + row.value, 0);

  const moonshots = holdingsSnapshot.filter((row) => row.bucket === 'MOONSHOT');
  const largestAltcoin = moonshots.reduce<(typeof moonshots)[number] | null>(
    (largest, row) => (!largest || row.value > largest.value ? row : largest),
    null,
  );

  const targetCoreRatio = numericEnv('CORE_RATIO', 0.9);
  const targetMoonshotRatio = numericEnv('MOONSHOT_RATIO', 0.1);
  const coreRatio = nav > 0 ? coreValue / nav : 0;
  const moonshotRatio = nav > 0 ? moonshotValue / nav : 0;

  return {
    created_at: new Date().toISOString(),
    nav,
    daily_pct: yesterdayNav && yesterdayNav > 0 ? ((nav - yesterdayNav) / yesterdayNav) * 100 : 0,
    max_drawdown_pct:
      allTimeHighNav && allTimeHighNav > 0 ? ((nav - allTimeHighNav) / allTimeHighNav) * 100 : 0,
    strategy_mode: strategyMode(),
    core_value: coreValue,
    moonshot_value: moonshotValue,
    core_ratio: coreRatio,
    moonshot_ratio: moonshotRatio,
    target_core_ratio: targetCoreRatio,
    target_moonshot_ratio: targetMoonshotRatio,
    core_ratio_deviation: coreRatio - targetCoreRatio,
    moonshot_ratio_deviation: moonshotRatio - targetMoonshotRatio,
    betting_vault_ratio: numericEnv('BETTING_VAULT_RATIO', 0),
    largest_altcoin_id: largestAltcoin?.coin_id ?? null,
    largest_altcoin_pct: largestAltcoin && nav > 0 ? largestAltcoin.value / nav : 0,
    clv_rolling_50: null,
    betting_velocity: 0,
    raw_prices: prices,
    holdings_snapshot: holdingsSnapshot,
  };
}

async function saveSnapshot(snapshot: KpiSnapshot): Promise<void> {
  await supabaseRequest('kpi_snapshots', {
    method: 'POST',
    headers: {
      prefer: 'return=minimal',
    },
    body: JSON.stringify(snapshot),
  });
}

export async function updateKpis(): Promise<KpiSnapshot> {
  const [prices, holdings, yesterdayNav, allTimeHighNav] = await Promise.all([
    fetchCoinGeckoPrices(),
    fetchHoldings(),
    fetchYesterdayNav(),
    fetchAllTimeHighNav(),
  ]);

  const missing = ALL_COIN_IDS.filter((id) => prices[id]?.usd === undefined);
  if (missing.length > 0) {
    console.warn(`Missing CoinGecko prices for: ${missing.join(', ')}`);
  }

  const snapshot = calculateSnapshot({ prices, holdings, yesterdayNav, allTimeHighNav });
  await saveSnapshot(snapshot);

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        created_at: snapshot.created_at,
        nav: snapshot.nav,
        daily_pct: snapshot.daily_pct,
        max_drawdown_pct: snapshot.max_drawdown_pct,
        core_ratio: snapshot.core_ratio,
        moonshot_ratio: snapshot.moonshot_ratio,
        largest_altcoin_id: snapshot.largest_altcoin_id,
        largest_altcoin_pct: snapshot.largest_altcoin_pct,
      },
      null,
      2,
    ),
  );

  return snapshot;
}

updateKpis().catch((error) => {
  console.error(error);
  process.exit(1);
});
