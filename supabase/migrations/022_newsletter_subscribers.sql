-- Migration 022: Newsletter subscribers table for weekly ClaudeMod digest

create table if not exists public.newsletter_subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             text not null,
  source            text not null default 'site',
  status            text not null default 'active' check (status in ('active', 'unsubscribed')),
  unsubscribe_token uuid not null default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  unsubscribed_at   timestamptz
);

create unique index if not exists newsletter_subscribers_email_lower_uidx
  on public.newsletter_subscribers (lower(email));

create unique index if not exists newsletter_subscribers_unsubscribe_token_uidx
  on public.newsletter_subscribers (unsubscribe_token);

create index if not exists newsletter_subscribers_active_created_idx
  on public.newsletter_subscribers (created_at desc)
  where status = 'active';

-- Strict RLS: no public read/write policies; only service_role API routes access this table.
alter table public.newsletter_subscribers enable row level security;
