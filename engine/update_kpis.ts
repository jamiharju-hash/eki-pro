import 'dotenv/config';

const COINGECKO_SIMPLE_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price';
const PRICE_STALE_LIMIT_MS = 30 * 60 * 1000;

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
    last_updated_at?: number;
  }
>;

type Holding = {
  coin_id: string;
  balance: number;
  bucket: Bucket;
};

type HoldingSnapshot = Holding & {
  price: number;
  value: number;
  change_24h_pct: number | null;
  last_updated_at: number | null;
};

type KpiSnapshot = {
  created_at: string;
  nav: number;
  daily_pct: number;
  max_drawdown_pct: number;
  strategy_mode: StrategyMode;
  data_is_stale: boolean;
  stale_coin_ids: string[];
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
  holdings_snapshot: HoldingSnapshot[];
};

const FALLBACK_HOLDINGS: Holding[] = [
  { coin_id: 'bitcoin', balance: 0, bucket: 'CORE' },
  { coin_id: 'ethereum', balance: 0, bucket: 'CORE' },
  { coin_id: 'autonolas', balance: 0, bucket: 'MOONSHOT' },
  { coin_id: 'aethir', balance: 0, bucket: 'MOONSHOT' },
  { coin_id: 'nosana', balance: 0, bucket: 'MOONSHOT' },
  { coin_id: 'fluence', balance: 0, bucket: 'MOONSHOT' },
  { coin_id: 'clearpool', balance: 0, bucket: 'MOONSHOT' },
  { coin_id: 'maple', balance: 0, bucket: 'MOONSHOT' },
  { coin_id: 'goldfinch', balance: 0, bucket: 'MOONSHOT' },
  { coin_id: 'paal-ai', balance: 0, bucket: 'MOONSHOT' },
  { coin_id: '0x0-ai-smart-contract', balance: 0, bucket: 'MOONSHOT' },
];

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function optionalEnv(name: string): string | null {
  const value = process.env[name];
  return value === undefined || value === '' ? null : value;
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

function configuredStrategyMode(): StrategyMode {
  const value = process.env.STRATEGY_MODE ?? 'OFF';
  if (value === 'ON' || value === 'LIMITED' || value === 'OFF') return value;
  throw new Error(`Invalid STRATEGY_MODE: ${value}`);
}

function resolveStrategyMode(prices: PricePayload): Pick<KpiSnapshot, 'strategy_mode' | 'data_is_stale' | 'stale_coin_ids'> {
  const now = Date.now();
  const staleCoinIds = ALL_COIN_IDS.filter((coinId) => {
    const lastUpdatedAt = prices[coinId]?.last_updated_at;
    if (!lastUpdatedAt) return true;
    return now - lastUpdatedAt * 1000 > PRICE_STALE_LIMIT_MS;
  });

  const dataIsStale = staleCoinIds.length > 0;

  return {
    strategy_mode: dataIsStale ? 'LIMITED' : configuredStrategyMode(),
    data_is_stale: dataIsStale,
    stale_coin_ids: staleCoinIds,
  };
}

async function fetchCoinGeckoPrices(): Promise<PricePayload> {
  const params = new URLSearchParams({
    ids: ALL_COIN_IDS.join(','),
    vs_currencies: 'usd',
    include_24hr_change: 'true',
    include_last_updated_at: 'true',
    precision: '2',
  });

  const response = await fetch(`${COINGECKO_SIMPLE_PRICE_URL}?${params}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': requiredEnv('NEXT_PUBLIC_CG_API_KEY'),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`CoinGecko request failed: ${response.status} ${body}`);
  }

  return response.json() as Promise<PricePayload>;
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const supabaseUrl = optionalEnv('SUPABASE_URL')?.replace(/\/$/, '');
  const serviceRoleKey = optionalEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase is not configured');
  }

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
  if (!optionalEnv('SUPABASE_URL') || !optionalEnv('SUPABASE_SERVICE_ROLE_KEY')) {
    return FALLBACK_HOLDINGS;
  }

  const coinFilter = `(${ALL_COIN_IDS.map((id) => `"${id}"`).join(',')})`;
  const rows = await supabaseRequest<Array<{ coin_id: string; balance: string | number; bucket: Bucket }>>(
    `portfolio_holdings?select=coin_id,balance,bucket&coin_id=in.${encodeURIComponent(coinFilter)}`,
  );

  if (rows.length === 0) return FALLBACK_HOLDINGS;

  return rows.map((row) => ({
    coin_id: row.coin_id,
    balance: Number(row.balance),
    bucket: row.bucket,
  }));
}

async function fetchYesterdayNav(): Promise<number | null> {
  if (!optionalEnv('SUPABASE_URL') || !optionalEnv('SUPABASE_SERVICE_ROLE_KEY')) return null;

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const rows = await supabaseRequest<Array<{ nav: string | number }>>(
    `kpi_snapshots?select=nav&created_at=lte.${encodeURIComponent(cutoff)}&order=created_at.desc&limit=1`,
  );

  return rows[0]?.nav === undefined ? null : Number(rows[0].nav);
}

async function fetchAllTimeHighNav(): Promise<number | null> {
  if (!optionalEnv('SUPABASE_URL') || !optionalEnv('SUPABASE_SERVICE_ROLE_KEY')) return null;

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

  const holdingsSnapshot: HoldingSnapshot[] = holdings.map((holding) => {
    const priceData = prices[holding.coin_id];
    const price = priceData?.usd ?? 0;

    return {
      ...holding,
      price,
      value: holding.balance * price,
      change_24h_pct: priceData?.usd_24h_change ?? null,
      last_updated_at: priceData?.last_updated_at ?? null,
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
  const risk = resolveStrategyMode(prices);

  return {
    created_at: new Date().toISOString(),
    nav,
    daily_pct: yesterdayNav && yesterdayNav > 0 ? ((nav - yesterdayNav) / yesterdayNav) * 100 : 0,
    max_drawdown_pct:
      allTimeHighNav && allTimeHighNav > 0 ? ((nav - allTimeHighNav) / allTimeHighNav) * 100 : 0,
    ...risk,
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
  if (!optionalEnv('SUPABASE_URL') || !optionalEnv('SUPABASE_SERVICE_ROLE_KEY')) {
    console.warn('Supabase is not configured. KPI snapshot was calculated but not persisted.');
    return;
  }

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
        strategy_mode: snapshot.strategy_mode,
        data_is_stale: snapshot.data_is_stale,
        stale_coin_ids: snapshot.stale_coin_ids,
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
