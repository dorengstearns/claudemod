-- Seed initial curated TypeScript mods (Claude Code 2.1.287+ in-process plugins)
insert into public.mods (
  slug, name, description, long_description, category,
  github_url, author_github, author_name,
  tags, github_stars, is_featured, status
) values

(
  'cctop',
  'cctop',
  'A btop-style live dashboard pane for Claude Code showing context fill, token counts, cost, cache hit ratio, and subagent latencies.',
  '## Overview

`cctop` brings a terminal system-monitor (btop/htop style) directly into your Claude Code session as an interactive split pane.

## Features
- Real-time context window usage & token counter
- Running cost and cache hit ratio breakdown
- Per-tool latency graphs
- Subagent and background task tracking
- Low footprint, zero model overhead',
  'mod',
  'https://github.com/tomstagl/cctop',
  'tomstagl',
  'Tom Stagl',
  ARRAY['dashboard', 'metrics', 'context', 'cost', 'system-monitor', 'typescript'],
  420,
  true,
  'approved'
),

(
  'terminal-browser',
  'Terminal Browser',
  'Browse documentation, GitHub pull requests, and web pages in a split terminal pane directly beside your Claude Code conversation.',
  '## Overview

`terminal-browser` renders web pages, PR diffs, and API documentation in a side-by-side terminal pane so you never have to leave your CLI while pair programming with Claude.

## Features
- Side-by-side terminal web viewing
- GitHub PR and issue inspector
- Live markdown documentation preview
- Instant keyboard toggle',
  'mod',
  'https://github.com/zenbu-labs/terminal-browser',
  'zenbu-labs',
  'Zenbu Labs',
  ARRAY['browser', 'ui', 'split-pane', 'documentation', 'github-pr', 'typescript'],
  510,
  true,
  'approved'
),

(
  'flightdeck',
  'Claude Flightdeck',
  'Live agent dashboard pane with context consumption, advisor timeline, permission verdicts, and subagent swimlanes.',
  '## Overview

An observability and supervisory mod for Claude Code. Flightdeck gives you an instant high-level overview of complex multi-step reasoning trajectories.

## Features
- Subagent swimlanes & status cards
- Advisor decision timeline
- Real-time tool execution & permission logging
- Non-invasive read-only monitoring',
  'mod',
  'https://github.com/scasella/claude-flightdeck',
  'scasella',
  'Sam Casella',
  ARRAY['agent', 'dashboard', 'visualization', 'observability', 'subagents', 'typescript'],
  380,
  true,
  'approved'
),

(
  'agent-flow',
  'Agent Flow',
  'Interactive visual tree of the active session''s subagents, background tasks, and teammates beside the transcript via /flow.',
  '## Overview

`agent-flow` maps out agent orchestration into an interactive terminal tree view using the `/flow` slash command.

## Features
- Real-time hierarchical agent tree
- Visual status indicators for completed, running, and stalled subagents
- Seamless integration with Claude Code multi-agent workflows',
  'mod',
  'https://github.com/Charlie0113-T/claude-agent-flow',
  'Charlie0113-T',
  'Charlie',
  ARRAY['subagents', 'visualization', 'workflow', 'teams', 'tree', 'typescript'],
  260,
  false,
  'approved'
),

(
  'statuspane',
  'Claude Statuspane',
  'Floating terminal status card showing model, effort tier, context remaining, spending, git branch, and CI check status.',
  '## Overview

`statuspane` adds a comprehensive floating status bar directly above your prompt, summarizing everything you need to know about your current session and git state.

## Features
- Current model and effort tier indicator
- Context usage and 5-hour quota countdown
- Active git branch & commit status
- GitHub CI check statuses updated live',
  'mod',
  'https://github.com/xuanji86/claude-statuspane',
  'xuanji86',
  'Xuanji',
  ARRAY['statusline', 'git', 'ci-cd', 'metrics', 'ui', 'typescript'],
  310,
  false,
  'approved'
),

(
  'context-lens',
  'Context Lens',
  'Live context statusline tracking token window fill and turn growth, plus an expandable breakdown pane.',
  '## Overview

A lightweight mod dedicated to tracking your context window health and growth velocity across turns.

## Features
- Pinned single-line context meter
- Turn-by-turn delta calculation
- Warning alerts before automatic context truncation',
  'mod',
  'https://github.com/Arunjay4213/claude-mods',
  'Arunjay4213',
  'Arunjay',
  ARRAY['context', 'token-counter', 'statusline', 'optimization', 'typescript'],
  195,
  false,
  'approved'
),

(
  'burn-meter',
  'Burn Meter',
  'Visual fire meter above the prompt visualizing session token spend and 5-hour quota thresholds in real time.',
  '## Overview

`burn-meter` keeps your API spending top of mind with a fun and informative progress meter above your terminal prompt.

## Features
- Real-time spend meter
- 5-hour and 7-day rate-limit countdown alerts
- Detailed `/burn` command for turn-by-turn cost history',
  'mod',
  'https://github.com/OneWave-AI/claude-code-mods',
  'OneWave-AI',
  'OneWave',
  ARRAY['quota', 'spend-tracker', 'rate-limits', 'ui', 'typescript'],
  175,
  false,
  'approved'
),

(
  'effort-cycle',
  'Effort Cycle',
  'Quickly cycle Claude Code reasoning effort levels using Alt+E with a compact colored footer meter.',
  '## Overview

Switch between reasoning effort tiers on the fly without interrupting your conversational flow or typing manual slash commands.

## Features
- Alt+E / Alt+Shift+E shortcut handling
- Colored footer effort meter
- Zero transcript pollution',
  'mod',
  'https://github.com/Anerco/effort-cycle-mod',
  'Anerco',
  'Anerco',
  ARRAY['keyboard-shortcuts', 'effort-level', 'thinking', 'productivity', 'typescript'],
  140,
  false,
  'approved'
)

on conflict (slug) do nothing;

-- Ensure vote counts are correct
update public.mods m
set vote_count = coalesce((select count(*) from public.votes v where v.mod_id = m.id), 0);
