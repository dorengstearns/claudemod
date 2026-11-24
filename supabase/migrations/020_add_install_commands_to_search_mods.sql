-- Migration 020: Include install_commands in search_mods RPC for 1-click copy on browse cards

DROP FUNCTION IF EXISTS search_mods(text, mod_category, text, integer, integer, text, text, text);

CREATE OR REPLACE FUNCTION search_mods(
  query         text default null,
  p_category    mod_category default null,
  p_sort        text default 'stars',
  p_limit       integer default 24,
  p_offset      integer default 0,
  p_subcategory text default null,
  p_permission  text default null,
  p_surface     text default null
)
RETURNS TABLE (
  id                 uuid,
  slug               varchar,
  name               varchar,
  description        text,
  thumbnail_url      text,
  category           mod_category,
  github_url         text,
  author_github      varchar,
  author_name        varchar,
  tags               text[],
  vote_count         integer,
  github_stars       integer,
  is_featured        boolean,
  is_official        boolean,
  install_commands   text[],
  permissions_level  text,
  permissions_labels text[],
  surfaces           text[],
  mod_subcategory    text,
  created_at         timestamptz,
  rank               float4
)
LANGUAGE sql STABLE AS $$
  SELECT
    m.id,
    m.slug,
    m.name,
    m.description,
    m.thumbnail_url,
    m.category,
    m.github_url,
    m.author_github,
    m.author_name,
    m.tags,
    m.vote_count,
    m.github_stars,
    m.is_featured,
    m.is_official,
    m.install_commands,
    m.permissions_level,
    m.permissions_labels,
    m.surfaces,
    m.mod_subcategory,
    m.created_at,
    CASE
      WHEN query IS NOT NULL AND query != ''
        THEN ts_rank_cd(m.search_vector, websearch_to_tsquery('english', query))
      ELSE 0
    END::float4 AS rank
  FROM public.mods m
  WHERE
    m.status = 'approved'
    AND (p_category IS NULL OR m.category = p_category)
    AND (p_subcategory IS NULL OR p_subcategory = '' OR m.mod_subcategory = p_subcategory)
    AND (p_permission IS NULL OR p_permission = '' OR m.permissions_level = p_permission)
    AND (p_surface IS NULL OR p_surface = '' OR p_surface = ANY(m.surfaces))
    AND (
      query IS NULL OR query = '' OR
      m.search_vector @@ websearch_to_tsquery('english', query) OR
      m.name ILIKE '%' || query || '%' OR
      m.description ILIKE '%' || query || '%' OR
      m.author_github ILIKE '%' || query || '%'
    )
  ORDER BY
    CASE WHEN p_sort = 'stars' THEN m.github_stars END DESC NULLS LAST,
    CASE WHEN p_sort = 'votes' THEN m.vote_count END DESC,
    CASE WHEN p_sort = 'newest' THEN m.created_at END DESC,
    rank DESC,
    m.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;
