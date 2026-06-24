-- Tom Laroc — Supabase schema
-- Run this in the SQL Editor of Tom's OWN free Supabase project.
-- (Dashboard → SQL Editor → paste → Run.)
--
-- The app talks to these tables with the SERVICE ROLE key from the server only,
-- so Row Level Security stays ON with no public policies — nothing is readable
-- from the browser.

create extension if not exists "pgcrypto";

-- ---------- inquiries (leads from "Work With Tom") ----------
create table if not exists public.inquiries (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text not null,
  company         text,
  role            text,
  website         text,
  industry        text,
  focus           jsonb,
  challenge       text,
  timeline        text,
  budget          text,
  notes           text,
  status          text not null default 'new',   -- new | contacted | client
  last_emailed_at timestamptz,
  last_template   text
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- ---------- subscribers (Inner Circle) ----------
create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique
);

create index if not exists subscribers_created_at_idx on public.subscribers (created_at desc);

-- RLS on, no public policies → only the service role (server) can read/write.
alter table public.inquiries  enable row level security;
alter table public.subscribers enable row level security;
