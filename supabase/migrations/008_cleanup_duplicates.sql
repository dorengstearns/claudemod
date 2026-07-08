-- 1. Delete duplicate superpowers mod (slug: 'superpowers') which has 0 votes, keeping 'obra-superpowers'
delete from public.mods where slug = 'superpowers';

-- 2. Reset long_description of all monorepo sub-mods so the next cron job fetches their specific files
update public.mods
set long_description = null
where github_url like '%/tree/%' or github_url like '%/blob/%';
