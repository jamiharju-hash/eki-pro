-- EKI Rakennus mobile-first web app schema
-- Run in Supabase SQL Editor before deploying the app.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  area text not null,
  project_type text not null,
  budget_min integer,
  budget_max integer,
  timeline text,
  message text,
  source text not null default 'website',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'uusi_liidi' check (status in ('uusi_liidi','kontaktoitu','esikarsinta','katselmus_sovittu','tarjous_lahetetty','neuvottelu','sopimus','valmis_laskutettu','hylatty')),
  score integer not null default 0 check (score >= 0 and score <= 100),
  golden_job boolean not null default false,
  notes text
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  offer_number text not null unique,
  lead_id uuid references public.leads(id) on delete set null,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  worksite_address text,
  description text,
  rows jsonb not null default '[]'::jsonb,
  materials_total numeric(12,2) not null default 0,
  labor_total numeric(12,2) not null default 0,
  subcontracting_total numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  vat_rate numeric(5,2) not null default 25.5,
  vat_total numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','sent','accepted','rejected'))
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete set null,
  offer_id uuid references public.offers(id) on delete set null,
  title text not null,
  address text,
  start_date date,
  end_date date,
  revenue numeric(12,2),
  gross_margin_pct numeric(5,2),
  status text not null default 'planned' check (status in ('planned','active','waiting','completed','invoiced'))
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_golden_job_idx on public.leads(golden_job);
create index if not exists offers_created_at_idx on public.offers(created_at desc);

alter table public.leads enable row level security;
alter table public.offers enable row level security;
alter table public.projects enable row level security;

-- MVP security model:
-- No anonymous direct table access. Next.js API routes use SUPABASE_SERVICE_ROLE_KEY server-side.
-- Add Supabase Auth + user-scoped policies when the CRM moves from admin-key MVP to full login.
