-- Migration 019: Add install commands, static capability/permission footprints,
-- surfaces, Mod sub-categories, official flag, and filtered search_mods RPC.

-- 1. Add structured metadata columns to public.mods
ALTER TABLE public.mods
  ADD COLUMN IF NOT EXISTS install_commands      text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS permissions_level     text,
  ADD COLUMN IF NOT EXISTS permissions_labels    text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS hooks_events          text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS surfaces              text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS mod_subcategory       text,
  ADD COLUMN IF NOT EXISTS tested_claude_version text,
  ADD COLUMN IF NOT EXISTS license               text,
  ADD COLUMN IF NOT EXISTS is_official           boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS repo_subpath          text;

-- 2. Partial indexes for fast filtered browsing on approved mods
CREATE INDEX IF NOT EXISTS mods_subcategory_approved_idx
  ON public.mods(mod_subcategory)
  WHERE status = 'approved' AND category = 'mod';

CREATE INDEX IF NOT EXISTS mods_permissions_level_approved_idx
  ON public.mods(permissions_level)
  WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS mods_surfaces_gin_idx
  ON public.mods USING gin(surfaces)
  WHERE status = 'approved';

-- 3. Replace search_mods RPC with optional sub-category, permission & surface filters
--    (keeps heavy long_description excluded for minimal database egress)
DROP FUNCTION IF EXISTS search_mods(text, mod_category, text, integer, integer);
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

-- 4. Sub-category counts RPC for approved in-process Mods
CREATE OR REPLACE FUNCTION get_mod_subcategory_counts()
RETURNS TABLE (mod_subcategory text, count bigint)
LANGUAGE sql STABLE AS $$
  SELECT mod_subcategory, count(*)
  FROM public.mods
  WHERE status = 'approved'
    AND category = 'mod'
    AND mod_subcategory IS NOT NULL
  GROUP BY mod_subcategory;
$$;
