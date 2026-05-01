import { numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const kpiHistory = pgTable('kpi_history', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  nav: numeric('nav', { precision: 18, scale: 2 }).notNull(),
  dailyReturnPct: numeric('daily_return_pct', { precision: 10, scale: 4 }).notNull(),
  maxDrawdownPct: numeric('max_drawdown_pct', { precision: 10, scale: 4 }).notNull(),
  strategyMode: text('strategy_mode').notNull(),
  corePct: numeric('core_pct', { precision: 10, scale: 4 }).notNull(),
  moonshotPct: numeric('moonshot_pct', { precision: 10, scale: 4 }).notNull(),
  bettingVaultPct: numeric('betting_vault_pct', { precision: 10, scale: 4 }).notNull(),
  topAltcoinName: text('top_altcoin_name').notNull(),
  clvRolling50: numeric('clv_rolling_50', { precision: 10, scale: 4 }).notNull(),
  bettingVelocity: numeric('betting_velocity', { precision: 18, scale: 2 }).notNull(),
});

export type KpiHistoryInsert = typeof kpiHistory.$inferInsert;
export type KpiHistorySelect = typeof kpiHistory.$inferSelect;
