-- Curated seed mods for claudemod.com launch
insert into public.mods (
  slug, name, description, long_description, category,
  github_url, author_github, author_name,
  tags, github_stars, is_featured, status
) values

(
  'claude-flow',
  'claude-flow',
  'The #1 AI automation framework — 87.8% SWE-bench verified. An advanced multi-agent orchestration system for Claude Code with enterprise-grade agentic capabilities.',
  '## Overview

claude-flow is a production-grade multi-agent orchestration harness for Claude Code. It deploys 60+ specialized AI agents working collaboratively on complex tasks with intelligent task routing using Q-learning routers.

## Features

- **60+ Specialized Agents** — coders, testers, reviewers, architects, security workers
- **Neural Memory** — HNSW vector database with persistent knowledge graphs
- **Swarm Coordination** — hierarchical agent management with consensus algorithms
- **Multi-provider Support** — Claude, GPT, Gemini, local models with automatic failover
- **CLI + MCP Server** — dual interface for terminal and IDE integration

## Installation

```bash
npx claude-flow@alpha init --sparc
```

Or for a full setup:

```bash
git clone https://github.com/ruvnet/claude-flow
cd claude-flow
npm install
npm run build
```

## Usage

```bash
# Start the orchestrator
claude-flow start

# Assign a complex task to the swarm
claude-flow task "Build a full-stack authentication system with tests"
```',
  'harness',
  'https://github.com/ruvnet/claude-flow',
  'ruvnet',
  'Reuven Cohen',
  ARRAY['multi-agent', 'orchestration', 'automation', 'enterprise', 'cli', 'swarm'],
  850,
  true,
  'approved'
),

(
  'everything-claude-code',
  'everything-claude-code',
  'A comprehensive bundle of Claude Code optimizations: hooks, commands, CLAUDE.md configs, MCP setups, and workflow automations — everything you need in one repo.',
  '## Overview

everything-claude-code is a curated plugin bundle covering the full surface area of Claude Code customization. Includes pre-built hooks for git automation, slash commands for common dev tasks, optimized CLAUDE.md templates, and MCP server configurations.

## Whats Included

- **13+ Specialized Agents** for different development tasks
- **48+ Skills** covering testing, documentation, refactoring, and more
- **32 Slash Commands** for common workflows
- **Multi-language rules** (TypeScript, Python, Go, Rust)
- **Pre-configured hooks** for git, testing, and deployment
- **MCP server configs** for common integrations

## Installation

```bash
git clone https://github.com/affaan-m/everything-claude-code
cd everything-claude-code
./install.sh
```

This copies all skills, commands, and configs into your `~/.claude/` directory.',
  'plugin',
  'https://github.com/affaan-m/everything-claude-code',
  'affaan-m',
  'Affaan M',
  ARRAY['bundle', 'hooks', 'commands', 'config', 'all-in-one', 'agents', 'skills'],
  420,
  true,
  'approved'
),

(
  'awesome-claude-code',
  'awesome-claude-code',
  'The definitive curated list of Claude Code resources: tools, workflows, tricks, MCP servers, and community projects. Community-maintained with 21k+ stars.',
  '## Overview

The community-maintained awesome list cataloguing the best Claude Code resources. Covers MCP integrations, workflow automations, CLAUDE.md examples, prompt engineering guides, and third-party tools.

## Categories

- **Official Resources** — Anthropic docs, changelog, release notes
- **MCP Servers** — curated list of Model Context Protocol servers
- **Skills & Commands** — community-built automations
- **CLAUDE.md Examples** — real-world configuration files
- **Tips & Tricks** — power-user techniques
- **Community Projects** — frameworks and tools built on Claude Code

## Contributing

Submit a PR to add your tool, skill, or resource. The list is actively maintained and reviewed.',
  'config',
  'https://github.com/hesreallyhim/awesome-claude-code',
  'hesreallyhim',
  null,
  ARRAY['awesome-list', 'resources', 'community', 'curated', 'mcp', 'skills'],
  310,
  true,
  'approved'
),

(
  'openclaw',
  'OpenClaw',
  'Secure, sandboxed Claude Code integration by Composio — connects Claude Code to 250+ external tools and APIs with enterprise-grade permission controls.',
  '## Overview

OpenClaw by ComposioHQ provides a secure MCP server harness for Claude Code that safely bridges it to hundreds of external services. Features credential isolation, permission scoping, and audit logging.

## Supported Integrations

- **Communication** — Slack, Gmail, Discord, Telegram
- **Dev Tools** — GitHub, GitLab, Jira, Linear, Notion
- **Cloud** — AWS, GCP, Azure, Vercel, Railway
- **Databases** — Supabase, PlanetScale, Neon
- **And 200+ more** via Composio connectors

## Installation

```bash
npm install -g @composio/openclaw
openclaw init
```

Then add to your Claude Code MCP config:
```json
{
  "mcpServers": {
    "openclaw": {
      "command": "openclaw",
      "args": ["serve"]
    }
  }
}
```',
  'mcp-server',
  'https://github.com/ComposioHQ/secure-openclaw',
  'ComposioHQ',
  'Composio',
  ARRAY['mcp', 'integrations', 'security', 'enterprise', 'api', 'composio'],
  280,
  true,
  'approved'
),

(
  'awesome-claude-skills',
  'awesome-claude-skills',
  'A curated collection of Claude Code skills — markdown-based workflow automations you can drop into any project for instant AI-powered task execution.',
  '## Overview

A well-organized library of Claude Code skills covering development workflows, code review, documentation generation, testing automation, and more.

## Skill Categories

- **Development** — TDD workflows, code review, refactoring
- **Documentation** — README generation, API docs, changelogs
- **Testing** — unit tests, integration tests, test coverage
- **Git** — commit messages, PR descriptions, branch management
- **Security** — vulnerability scanning, dependency auditing
- **DevOps** — CI/CD configuration, Docker, deployment scripts

## Installation

Copy any skill folder to `~/.claude/skills/`:

```bash
cp -r skills/code-review ~/.claude/skills/
```

Then use it in Claude Code:
```
/code-review
```',
  'skill',
  'https://github.com/travisvn/awesome-claude-skills',
  'travisvn',
  'Travis VN',
  ARRAY['skills', 'workflows', 'automations', 'markdown', 'collection', 'tdd'],
  190,
  false,
  'approved'
),

(
  'mcp-servers-reference',
  'MCP Servers (Official)',
  'The official Anthropic collection of reference MCP server implementations — filesystem, git, memory, fetch, and more. The canonical starting point for MCP integration.',
  '## Overview

The official reference implementations for Model Context Protocol servers maintained by the MCP team. These are the canonical, battle-tested implementations of common tool integrations.

## Included Servers

- **filesystem** — Read/write local files with configurable path restrictions
- **git** — Git repository operations (log, diff, status, blame)
- **memory** — Persistent key-value memory store for Claude
- **fetch** — Web page fetching and content extraction
- **github** — GitHub API integration (issues, PRs, repos)
- **google-drive** — Read and search Google Drive files
- **postgres** — Read-only Postgres database access
- **sqlite** — SQLite database operations
- **slack** — Slack messaging and channel management

## Installation

```bash
npx @modelcontextprotocol/server-filesystem /path/to/allow
```

Or add to `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
    }
  }
}
```',
  'mcp-server',
  'https://github.com/modelcontextprotocol/servers',
  'modelcontextprotocol',
  'MCP Team',
  ARRAY['filesystem', 'git', 'memory', 'official', 'mcp', 'reference', 'fetch'],
  2100,
  true,
  'approved'
),

(
  'claude-code-react-skill',
  'React Component Skill',
  'A specialized Claude Code skill for generating production-ready React components with TypeScript, accessibility best practices, and Tailwind CSS styling.',
  '## Overview

Drop this skill into your `.claude/skills/` directory to give Claude Code a specialized React component generation mode with opinionated defaults.

## What It Does

When invoked, this skill instructs Claude to:
- Generate TypeScript components with proper prop types
- Include ARIA attributes and keyboard navigation
- Use Tailwind CSS utility classes by default
- Add Storybook stories alongside components
- Write accompanying unit tests with React Testing Library

## Installation

```bash
# Copy skill to your Claude config
cp -r react-component-skill ~/.claude/skills/react-component/

# Or globally
cp -r react-component-skill /usr/local/share/claude/skills/react-component/
```

## Usage

```
/react-component Button with loading state and disabled variant
```

Claude will generate the component, types, tests, and story.',
  'skill',
  'https://github.com/anthropics/claude-code',
  'anthropics',
  'Anthropic',
  ARRAY['react', 'skill', 'components', 'typescript', 'tailwind', 'a11y'],
  0,
  false,
  'approved'
),

(
  'claude-code-git-hooks',
  'Git Automation Hooks',
  'A collection of Claude Code hooks for automating git workflows — auto-generate commit messages, PR descriptions, changelogs, and enforce conventional commits.',
  '## Overview

A practical set of Claude Code hooks that integrate with your git workflow to automate repetitive tasks and enforce code quality standards.

## Included Hooks

### PreToolUse: Bash
Intercepts `git commit` commands to:
- Generate conventional commit messages from staged diff
- Validate commit format before allowing commit

### PostToolUse: Bash
After successful commits:
- Update CHANGELOG.md with new entry
- Suggest PR description if on a feature branch

### Stop Hook
On session end:
- Summarize all changes made in the session
- Create a draft PR description

## Installation

Add to `~/.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "~/.claude/hooks/git-pre.sh" }]
    }]
  }
}
```',
  'hook',
  'https://github.com/anthropics/claude-code',
  'anthropics',
  'Anthropic',
  ARRAY['hooks', 'git', 'automation', 'commits', 'changelog', 'conventional-commits'],
  0,
  false,
  'approved'
);

-- Ensure vote counts are correct (safety measure)
update public.mods m
set vote_count = (select count(*) from public.votes v where v.mod_id = m.id);
