-- Migration 017: Return long_description in search_mods function so cards on category and browse pages render visual thumbnails

drop function if exists search_mods(text, mod_category, text, integer, integer);

create or replace function search_mods(
  query       text default null,
  p_category  mod_category default null,
  p_sort      text default 'votes',
  p_limit     integer default 24,
  p_offset    integer default 0
)
returns table (
  id               uuid,
  slug             varchar,
  name             varchar,
  description      text,
  long_description text,
  category         mod_category,
  github_url       text,
  author_github    varchar,
  author_name      varchar,
  tags             text[],
  vote_count       integer,
  github_stars     integer,
  is_featured      boolean,
  created_at       timestamptz,
  rank             float4
)
language sql stable as $$
  select
    m.id,
    m.slug,
    m.name,
    m.description,
    m.long_description,
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
