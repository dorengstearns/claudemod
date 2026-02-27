-- Add marketing skills mod
insert into public.mods (
  slug, name, description, long_description, category,
  github_url, author_github, author_name,
  tags, github_stars, is_featured, status
) values
('marketingskills',
 'Marketing Skills',
 'Corey Haines'' collection of AI agent skills for marketing professionals — conversion rate optimization, copywriting, SEO, analytics, growth engineering, and pricing strategy, all as drop-in Claude Code skills.',
 NULL, 'skill',
 'https://github.com/coreyhaines31/marketingskills', 'coreyhaines31', 'Corey Haines',
 ARRAY['marketing', 'conversion', 'copywriting', 'seo', 'analytics', 'growth', 'skills'],
 9600, true, 'approved');

-- Ensure vote counts are correct (safety measure)
update public.mods m
set vote_count = (select count(*) from public.votes v where v.mod_id = m.id);
