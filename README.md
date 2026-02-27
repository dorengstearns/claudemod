# ClaudeMod

A mod discovery platform for [Claude Code](https://claude.ai/code) — think Nexus Mods but for CLAUDE.md configs, slash commands, hooks, and MCP setups.

**[claudemod.com](https://www.claudemod.com)**

## What it is

Claude Code is highly configurable: you can drop in custom instructions, slash commands, hooks, and MCP server configs to change how it behaves. ClaudeMod is a curated directory of these mods — 140+ community-built configurations you can browse, vote on, and drop straight into your own setup.

## Stack

- **Next.js** (App Router) — frontend and API routes
- **Supabase** — Postgres database, auth, and storage
- **Tailwind CSS** + **shadcn/ui** — styling
- **Vercel** — hosting and cron jobs

## Running locally

```bash
npm install
cp .env.example .env.local  # fill in Supabase + GitHub credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) |
| `GITHUB_TOKEN` | GitHub PAT for fetching READMEs |
| `NEXT_PUBLIC_SITE_URL` | Full site URL (e.g. `https://www.claudemod.com`) |

## Database

Migrations live in `supabase/migrations/`. To set up locally:

```bash
supabase init
supabase start
supabase db reset  # runs all migrations + seed data
```
