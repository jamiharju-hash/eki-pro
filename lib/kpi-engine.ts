import { desc, max } from 'drizzle-orm';
import { fetchCoinPrices } from './coingecko';
import { getDb } from './db';
import { portfolioAssets } from './portfolio';
import { kpiHistory, type KpiHistoryInsert, type KpiHistorySelect } from './schema';

const STALE_LIMIT_SECONDS = 30 * 60;

export type DashboardKpi = {
  id: number | null;
  timestamp: string;
  nav: number;
  dailyReturnPct: number;
  maxDrawdownPct: number;
  strategyMode: 'ON' | 'LIMITED' | 'OFF';
  corePct: number;
  moonshotPct: number;
  bettingVaultPct: number;
  topAltcoinName: string;
  clvRolling50: number;
  bettingVelocity: number;
};

function asNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return 0;
}

function mapRow(row: KpiHistorySelect): DashboardKpi {
  return {
    id: row.id,
    timestamp: row.timestamp.toISOString(),
    nav: asNumber(row.nav),
    dailyReturnPct: asNumber(row.dailyReturnPct),
    maxDrawdownPct: asNumber(row.maxDrawdownPct),
    strategyMode: row.strategyMode as DashboardKpi['strategyMode'],
    corePct: asNumber(row.corePct),
    moonshotPct: asNumber(row.moonshotPct),
    bettingVaultPct: asNumber(row.bettingVaultPct),
    topAltcoinName: row.topAltcoinName,
    clvRolling50: asNumber(row.clvRolling50),
    bettingVelocity: asNumber(row.bettingVelocity),
  };
}

export async function getLatestKpi(): Promise<DashboardKpi | null> {
  const db = getDb();
  const [latest] = await db.select().from(kpiHistory).orderBy(desc(kpiHistory.timestamp)).limit(1);
  return latest ? mapRow(latest) : null;
}

export async function getKpiHistory(limit = 50): Promise<DashboardKpi[]> {
  const db = getDb();
  const rows = await db.select().from(kpiHistory).orderBy(desc(kpiHistory.timestamp)).limit(limit);
  return rows.reverse().map(mapRow);
}

export async function updateKpis(): Promise<DashboardKpi> {
  const db = getDb();
  const prices = await fetchCoinPrices();

  const values = portfolioAssets.map((asset) => {
    const price = prices[asset.id]?.usd ?? 0;
    const value = asset.balance * price;
    return {
      ...asset,
      price,
      value,
      change24hPct: prices[asset.id]?.usd_24h_change ?? 0,
      lastUpdatedAt: prices[asset.id]?.last_updated_at ?? 0,
    };
  });

  const nav = values.reduce((sum, asset) => sum + asset.value, 0);
  const coreValue = values.filter((asset) => asset.bucket === 'CORE').reduce((sum, asset) => sum + asset.value, 0);
  const moonshotValue = values.filter((asset) => asset.bucket === 'MOONSHOT').reduce((sum, asset) => sum + asset.value, 0);
  const corePct = nav > 0 ? (coreValue / nav) * 100 : 0;
  const moonshotPct = nav > 0 ? (moonshotValue / nav) * 100 : 0;

  const [athRow] = await db.select({ ath: max(kpiHistory.nav) }).from(kpiHistory);
  const ath = Math.max(asNumber(athRow?.ath), nav);
  const maxDrawdownPct = ath > 0 ? ((nav - ath) / ath) * 100 : 0;

  const weightedDailyReturnPct = nav > 0
    ? values.reduce((sum, asset) => sum + asset.change24hPct * (asset.value / nav), 0)
    : 0;

  const nowSeconds = Math.floor(Date.now() / 1000);
  const stale = values.some((asset) => !asset.lastUpdatedAt || nowSeconds - asset.lastUpdatedAt > STALE_LIMIT_SECONDS);
  const configuredMode = process.env.STRATEGY_MODE === 'OFF' || process.env.STRATEGY_MODE === 'LIMITED' ? process.env.STRATEGY_MODE : 'ON';
  const strategyMode = stale ? 'LIMITED' : configuredMode;

  const topAltcoin = values
    .filter((asset) => asset.bucket === 'MOONSHOT')
    .sort((a, b) => b.value - a.value)[0];

  const row: KpiHistoryInsert = {
    nav: nav.toFixed(2),
    dailyReturnPct: weightedDailyReturnPct.toFixed(4),
    maxDrawdownPct: maxDrawdownPct.toFixed(4),
    strategyMode,
    corePct: corePct.toFixed(4),
    moonshotPct: moonshotPct.toFixed(4),
    bettingVaultPct: Number(process.env.BETTING_VAULT_PCT ?? 0).toFixed(4),
    topAltcoinName: topAltcoin?.name ?? 'N/A',
    clvRolling50: Number(process.env.CLV_ROLLING_50 ?? 0).toFixed(4),
    bettingVelocity: Number(process.env.BETTING_VELOCITY ?? 0).toFixed(2),
  };

  const [inserted] = await db.insert(kpiHistory).values(row).returning();
  return mapRow(inserted);
}
