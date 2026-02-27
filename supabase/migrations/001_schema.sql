-- Extensions
create extension if not exists pg_trgm;

-- Enums
create type mod_category as enum (
  'skill',
  'mcp-server',
  'command',
  'agent',
  'harness',
  'hook',
  'plugin',
  'config'
);

create type mod_status as enum ('pending', 'approved', 'rejected');

-- Users table (mirrors GitHub OAuth profile)
create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  github_login varchar(255) not null unique,
  display_name varchar(255),
  avatar_url   text,
  github_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Mods table
create table public.mods (
  id               uuid primary key default gen_random_uuid(),
  slug             varchar(255) not null unique,
  name             varchar(255) not null,
  description      text not null,
  long_description text,
  category         mod_category not null,
  github_url       text not null,
  author_github    varchar(255) not null,
  author_name      varchar(255),
  tags             text[] not null default '{}',
  vote_count       integer not null default 0,
  github_stars     integer not null default 0,
  status           mod_status not null default 'approved',
  is_featured      boolean not null default false,
  submitted_by     uuid references public.users(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  search_vector    tsvector
);

-- Votes table (one vote per user per mod)
create table public.votes (
  id         uuid primary key default gen_random_uuid(),
  mod_id     uuid not null references public.mods(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint votes_mod_user_unique unique (mod_id, user_id)
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index mods_search_vector_idx
  on public.mods using gin(search_vector);

create index mods_name_trgm_idx
  on public.mods using gin(name gin_trgm_ops);

create index mods_description_trgm_idx
  on public.mods using gin(description gin_trgm_ops);

create index mods_category_status_idx
  on public.mods(category, status)
  where status = 'approved';

create index mods_vote_count_idx
  on public.mods(vote_count desc)
  where status = 'approved';

create index mods_created_at_idx
  on public.mods(created_at desc)
  where status = 'approved';

create index mods_featured_idx
  on public.mods(is_featured, vote_count desc)
  where status = 'approved' and is_featured = true;

create index votes_user_id_idx on public.votes(user_id);
create index votes_mod_id_idx  on public.votes(mod_id);

-- ─── Triggers ────────────────────────────────────────────────────────────────

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger mods_updated_at
  before update on public.mods
  for each row execute function update_updated_at();

create trigger users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

-- Maintain search_vector on insert/update
create or replace function update_search_vector()
returns trigger language plpgsql as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.author_github, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(new.tags, ' ')), 'C');
  return new;
end;
$$;

create trigger mods_search_vector
  before insert or update on public.mods
  for each row execute function update_search_vector();

-- Maintain vote_count on mods table (avoids COUNT(*) queries)
create or replace function sync_vote_count()
returns trigger language plpgsql security definer as $$
begin
  if (tg_op = 'INSERT') then
    update public.mods set vote_count = vote_count + 1 where id = new.mod_id;
  elsif (tg_op = 'DELETE') then
    update public.mods set vote_count = greatest(vote_count - 1, 0) where id = old.mod_id;
  end if;
  return null;
end;
$$;

create trigger votes_sync_count
  after insert or delete on public.votes
  for each row execute function sync_vote_count();

-- Auto-create user profile on first GitHub sign-in
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, github_login, display_name, avatar_url, github_url)
  values (
    new.id,
    new.raw_user_meta_data->>'user_name',
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_name'),
    new.raw_user_meta_data->>'avatar_url',
    'https://github.com/' || (new.raw_user_meta_data->>'user_name')
  )
  on conflict (id) do update set
    github_login = excluded.github_login,
    display_name = excluded.display_name,
    avatar_url   = excluded.avatar_url,
    updated_at   = now();
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.users enable row level security;
alter table public.mods   enable row level security;
alter table public.votes  enable row level security;

-- Users: anyone can read, only self can update
create policy "users_select_all" on public.users
  for select using (true);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- Mods: anyone can read approved mods
create policy "mods_select_approved" on public.mods
  for select using (status = 'approved');

-- Mods: authenticated users can submit (goes to pending)
create policy "mods_insert_authenticated" on public.mods
  for insert with check (auth.uid() is not null);

-- Mods: submitter can update their own pending mods
create policy "mods_update_own_pending" on public.mods
  for update using (auth.uid() = submitted_by and status = 'pending');

-- Votes: user can see their own votes
create policy "votes_select_own" on public.votes
  for select using (auth.uid() = user_id);

-- Votes: authenticated users can vote once per mod
create policy "votes_insert_authenticated" on public.votes
  for insert with check (auth.uid() is not null and auth.uid() = user_id);

-- Votes: user can unvote
create policy "votes_delete_own" on public.votes
  for delete using (auth.uid() = user_id);
