create table if not exists kpi_history (
  id serial primary key,
  timestamp timestamptz not null default now(),
  nav numeric(18, 2) not null,
  daily_return_pct numeric(10, 4) not null,
  max_drawdown_pct numeric(10, 4) not null,
  strategy_mode text not null,
  core_pct numeric(10, 4) not null,
  moonshot_pct numeric(10, 4) not null,
  betting_vault_pct numeric(10, 4) not null,
  top_altcoin_name text not null,
  clv_rolling_50 numeric(10, 4) not null,
  betting_velocity numeric(18, 2) not null
);

create index if not exists kpi_history_timestamp_idx on kpi_history (timestamp desc);
create index if not exists kpi_history_nav_idx on kpi_history (nav desc);
