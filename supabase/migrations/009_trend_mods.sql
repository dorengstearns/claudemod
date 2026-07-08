-- Seed 9 new trending mods (July 2026)

insert into public.mods (
  slug, name, description, long_description, category,
  github_url, author_github, author_name,
  tags, github_stars, is_featured, status
) values

(
  'sentry-mcp',
  'Sentry MCP Server',
  'Official Sentry Model Context Protocol server. Exposes issue details, Seer debugging context, and stack trace insights.',
  '## Overview

The official Sentry integration for coding agents. It exposes Sentry''s Seer APIs, allowing Claude Code to inspect stack traces, analyze error issues, and directly draft fixes for bugs.

## Features
- Query sentry error records
- Inspect traceback details
- Correlate issues with code changes',
  'mcp-server',
  'https://github.com/getsentry/sentry-mcp',
  'getsentry',
  'Sentry',
  ARRAY['sentry', 'mcp-server', 'monitoring', 'debugging', 'errors'],
  540,
  true,
  'approved'
),

(
  'slack-mcp-server',
  'Slack MCP Server',
  'Connect Claude Code to your Slack workspace to search channels, fetch histories, and post messages.',
  '## Overview

A lightweight Slack integration that allows Claude to search channels, read messaging histories, and post notifications without complex credential setup.

## Features
- Search workspace channels
- Post updates automatically
- Safe execution scope',
  'mcp-server',
  'https://github.com/korotovsky/slack-mcp-server',
  'korotovsky',
  'Alexey Korotovsky',
  ARRAY['slack', 'mcp-server', 'notifications', 'chat', 'collaboration'],
  95,
  false,
  'approved'
),

(
  'alirezarezvani-claude-skills',
  'Claude Agentic Skills Library',
  'Massive curated library of 345+ specialized skills, instructions, and custom Python agent tools for Claude Code.',
  '## Overview

A massive library featuring over 345+ specialized skills, agent plugins, and slash commands tailored for engineering, research, and analysis workflows.

## Features
- Python execution skills
- Structured workflow templates
- Custom slash-command prompts',
  'skill',
  'https://github.com/alirezarezvani/claude-skills',
  'alirezarezvani',
  'Alireza Rezvani',
  ARRAY['library', 'skills', 'workflows', 'custom-commands', 'agents'],
  1300,
  true,
  'approved'
),

(
  'claudemd-audit',
  'CLAUDE.md Audit Skill',
  'Audit and optimize your CLAUDE.md instructions. Classifies rules as vague or redundant to lower context overhead.',
  '## Overview

An auditing tool that analyzes a project''s `CLAUDE.md` instructions, classifying rules as "vague", "redundant", or "deterministic-eligible" to keep context overhead low.

## Features
- Analyze rules clarity
- Highlight dead instructions
- Propose hooks migrations',
  'skill',
  'https://github.com/blacksundev/claudemd-audit',
  'blacksundev',
  'blacksundev',
  ARRAY['claude-md', 'audit', 'context-reduction', 'optimization', 'skills'],
  45,
  false,
  'approved'
),

(
  'claudemd-loader',
  'CLAUDE.md Loader',
  'Python utility that allows splitting CLAUDE.md into modular rules with @import syntax and YAML frontmatter.',
  '## Overview

A Python utility supporting `@import` statements and YAML frontmatter inside `CLAUDE.md`, allowing developers to write modular, split-up rules that compile into a single file.

## Features
- Multi-file context imports
- Frontmatter conditional rules
- Context builder pipeline',
  'plugin',
  'https://github.com/jrialland/claudemd-loader',
  'jrialland',
  'Jean-Christophe Rialland',
  ARRAY['claude-md', 'loader', 'import', 'modular', 'configs'],
  80,
  false,
  'approved'
),

(
  'claude-code-tools',
  'Claude Code Tools',
  'CLI session utilities for Claude Code including tmux terminal integration, history wrappers, and automation helpers.',
  '## Overview

A suite of utilities for terminal integration, offering tmux wrappers, session managers, and history automation for command-line agents.

## Features
- tmux session attachments
- Context history dumps
- Automate repetitive terminal runs',
  'plugin',
  'https://github.com/pchalasani/claude-code-tools',
  'pchalasani',
  'Prasad Chalasani',
  ARRAY['cli', 'session-management', 'tmux', 'terminal', 'automation'],
  110,
  false,
  'approved'
),

(
  'joeyism-claude-config',
  'Claude Config TUI',
  'Terminal User Interface (TUI) utility to manage local settings.json and edit MCP server configurations.',
  '## Overview

A Terminal User Interface (TUI) designed to make managing, editing, and verifying local `settings.json` and linked MCP servers easy directly from the terminal.

## Features
- Graphical settings list
- Server status check TUI
- Hot-reload configurations',
  'plugin',
  'https://github.com/joeyism/claude-code-config',
  'joeyism',
  'Joey',
  ARRAY['config', 'tui', 'settings', 'mcp-server', 'terminal'],
  35,
  false,
  'approved'
),

(
  'awesome-claude-plugins',
  'Awesome Claude Plugins',
  'Curated registry tracking adoption metrics, stars, and versions of trending plugins, commands, and hooks.',
  '## Overview

An awesome list tracking the adoption metrics, stars, and versions of trending plugins, slash commands, and hooks in the ecosystem.

## Features
- Adoption metric tracker
- Trending plugins lists
- Automatic sync scripts',
  'config',
  'https://github.com/quemsah/awesome-claude-plugins',
  'quemsah',
  'quemsah',
  ARRAY['registry', 'awesome-list', 'metrics', 'discovery', 'config'],
  190,
  false,
  'approved'
),

(
  'claude-howto',
  'Claude How-To Guide',
  'Advanced examples and copy-paste templates covering subagent setups, hook pipelines, and custom commands.',
  '## Overview

An educational repository providing templates, config hacks, and step-by-step guides for custom subagent setups and slash command orchestration.

## Features
- Setup checklist
- Advanced agent loop hacks
- Pipeline setups templates',
  'config',
  'https://github.com/luongnv89/claude-howto',
  'luongnv89',
  'luongnv89',
  ARRAY['guide', 'examples', 'tutorials', 'subagents', 'hooks', 'config'],
  280,
  false,
  'approved'
)
on conflict (slug) do nothing;

-- Ensure vote counts are correct (safety measure)
update public.mods m
set vote_count = coalesce((select count(*) from public.votes v where v.mod_id = m.id), 0);
