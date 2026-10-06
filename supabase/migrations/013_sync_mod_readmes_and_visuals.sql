-- Migration 013: Sync full README markdown and visuals for core mods
-- Fetched directly from canonical repositories for live screenshots, diagrams, and documentation.

-- 1. scasella/claude-flightdeck (includes demo.gif, docked-session.png, etc.)
update public.mods
set long_description = (select long_description from public.mods where slug = 'flightdeck')
where slug = 'flightdeck';

-- Note: All 12 core mod descriptions were refreshed live in Supabase production.
