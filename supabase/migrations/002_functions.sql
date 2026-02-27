-- Search mods with FTS + trigram fallback
create or replace function search_mods(
  query       text default null,
  p_category  mod_category default null,
  p_sort      text default 'votes',
  p_limit     integer default 24,
  p_offset    integer default 0
)
returns table (
  id            uuid,
  slug          varchar,
  name          varchar,
  description   text,
  category      mod_category,
  github_url    text,
  author_github varchar,
  author_name   varchar,
  tags          text[],
  vote_count    integer,
  github_stars  integer,
  is_featured   boolean,
  created_at    timestamptz,
  rank          float4
)
language sql stable as $$
  select
    m.id,
    m.slug,
    m.name,
    m.description,
    m.category,
    m.github_url,
    m.author_github,
    m.author_name,
    m.tags,
    m.vote_count,
    m.github_stars,
    m.is_featured,
    m.created_at,
    case
      when query is not null and query != ''
        then ts_rank_cd(m.search_vector, websearch_to_tsquery('english', query))
      else 0
    end::float4 as rank
  from public.mods m
  where
    m.status = 'approved'
    and (p_category is null or m.category = p_category)
    and (
      query is null or query = '' or
      m.search_vector @@ websearch_to_tsquery('english', query) or
      m.name ilike '%' || query || '%' or
      m.description ilike '%' || query || '%'
    )
  order by
    case
      when query is not null and query != ''
        then ts_rank_cd(m.search_vector, websearch_to_tsquery('english', query))
      else 0
    end desc,
    case p_sort
      when 'votes' then m.vote_count
      when 'stars' then m.github_stars
      else 0
    end desc,
    case when p_sort = 'newest' then extract(epoch from m.created_at) end desc nulls last,
    m.vote_count desc
  limit p_limit
  offset p_offset;
$$;

-- Toggle vote: insert or delete, returns new vote state
create or replace function toggle_vote(p_mod_id uuid)
returns jsonb
language plpgsql security definer as $$
declare
  v_user_id uuid := auth.uid();
  v_exists  boolean;
  v_count   integer;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select exists(
    select 1 from public.votes
    where mod_id = p_mod_id and user_id = v_user_id
  ) into v_exists;

  if v_exists then
    delete from public.votes
    where mod_id = p_mod_id and user_id = v_user_id;
  else
    insert into public.votes (mod_id, user_id)
    values (p_mod_id, v_user_id);
  end if;

  select vote_count into v_count
  from public.mods where id = p_mod_id;

  return jsonb_build_object(
    'voted', not v_exists,
    'vote_count', v_count
  );
end;
$$;

-- Category counts for faceted navigation
create or replace function get_category_counts()
returns table (category mod_category, count bigint)
language sql stable as $$
  select category, count(*) as count
  from public.mods
  where status = 'approved'
  group by category
  order by count desc;
$$;

-- Get current user's voted mod IDs (for hydrating vote state)
-- Uses auth.uid() internally — no parameter accepted to prevent cross-user enumeration
create or replace function get_user_votes()
returns table (mod_id uuid)
language sql stable security definer as $$
  select mod_id from public.votes where user_id = auth.uid();
$$;
