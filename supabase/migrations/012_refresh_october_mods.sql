-- Clean up duplicate joeyism-claude-config entry in favor of claude-code-config-tui
delete from public.mods where slug = 'joeyism-claude-config';

-- Seed 10 new high-impact additions (October 2026 Refresh)
insert into public.mods (
  slug, name, description, long_description, category,
  github_url, author_github, author_name,
  tags, github_stars, is_featured, status
) values

(
  'secret-redactor',
  'Secret Redactor',
  'Automatically redacts API keys, credentials, IP addresses, and emails from terminal outputs and tool arguments before sending to the model.',
  '## Overview

`secret-redactor` is an in-process privacy mod for Claude Code that prevents credentials and sensitive data from leaking into model prompts or third-party logs.

## Features
- In-memory regex tokenization for API keys, bearer tokens, and private keys
- Stable placeholder replacement across conversation turns
- Safe round-trip restoration only during tool execution
- Works completely offline with zero performance overhead',
  'mod',
  'https://github.com/aidojo/secret-redactor',
  'aidojo',
  'AI Dojo',
  ARRAY['security', 'privacy', 'redaction', 'api-keys', 'compliance', 'typescript'],
  220,
  false,
  'approved'
),

(
  'launch-codes',
  'Launch Codes',
  'Interactive confirmation and one-time authorization codes for destructive or high-risk terminal commands.',
  '## Overview

`launch-codes` adds a two-factor verification step inside your Claude Code session before allowing execution of high-risk actions.

## Features
- Intercepts dangerous operations like `git push --force`, `rm -rf`, and production deployments
- Generates a transient one-time confirmation code
- Configurable command blocklists and custom authorization rules
- Seamless terminal prompts without breaking agent loops',
  'mod',
  'https://github.com/aidojo/launch-codes',
  'aidojo',
  'AI Dojo',
  ARRAY['safety', 'guardrails', 'confirmation', 'terminal', 'cli', 'typescript'],
  185,
  false,
  'approved'
),

(
  'gh-ci-status',
  'GitHub CI Status',
  'Pinned status line showing real-time GitHub Actions workflow runs and pull request check suites directly above the prompt.',
  '## Overview

Keep an eye on remote GitHub Actions CI test suites while continuing to code locally with Claude.

## Features
- Live check-run status updates above the prompt
- Pass, fail, and in-progress visual indicators
- Direct keyboard shortcuts to view remote error logs
- Automatic webhook/polling optimization',
  'mod',
  'https://github.com/aidojo/gh-ci-status',
  'aidojo',
  'AI Dojo',
  ARRAY['github', 'ci-cd', 'github-actions', 'statusline', 'testing', 'typescript'],
  160,
  false,
  'approved'
),

(
  'ccusage',
  'ccusage',
  'The premier local token usage, cost analyzer, and rolling 5-hour quota tracker for Claude Code and coding agents.',
  '## Overview

`ccusage` is the most popular CLI tool for analyzing Claude Code token spending, model breakdown, and quota velocity directly from local JSONL logs.

## Features
- Daily, weekly, and monthly cost summaries
- 5-hour and 7-day rate-limit window burn-down forecasts
- Runs entirely locally via `npx ccusage` with zero API key requirement
- Multi-model pricing support powered by LiteLLM',
  'plugin',
  'https://github.com/ryoppippi/ccusage',
  'ryoppippi',
  'Ryoppippi',
  ARRAY['analytics', 'cost-tracker', 'quota', 'tokens', 'cli', 'metrics'],
  1100,
  true,
  'approved'
),

(
  'linear-mcp',
  'Linear MCP Server',
  'Connect Claude Code to your Linear workspace to search issues, track projects, and update task statuses.',
  '## Overview

An open-source Model Context Protocol server enabling natural language project management with Linear.

## Features
- Search workspace issues and team backlogs
- Create new tasks with labels, priorities, and assignees
- Update issue statuses and add progress comments
- Safe scope filtering via Personal Access Tokens',
  'mcp-server',
  'https://github.com/tacticlaunch/mcp-linear',
  'tacticlaunch',
  'Tactic',
  ARRAY['linear', 'mcp-server', 'project-management', 'issues', 'collaboration'],
  450,
  true,
  'approved'
),

(
  'docker-mcp',
  'Docker MCP Server',
  'Interact directly with the local Docker daemon to inspect containers, stream logs, and debug development services.',
  '## Overview

A robust MCP integration giving Claude Code controlled, safe access to your local Docker runtime.

## Features
- Inspect running containers and image layers
- Stream container logs for debugging crashes
- Start, stop, and restart development containers
- Read-only safety mode for production hosts',
  'mcp-server',
  'https://github.com/ckreiling/mcp-server-docker',
  'ckreiling',
  'Chris Kreiling',
  ARRAY['docker', 'mcp-server', 'containers', 'devops', 'debugging'],
  620,
  false,
  'approved'
),

(
  'kubernetes-mcp',
  'Kubernetes MCP Server',
  'Native Go-based MCP server providing direct Kubernetes cluster inspection, pod logs, and resource management.',
  '## Overview

An official-grade MCP server that communicates directly with the Kubernetes API without relying on shell wrappers.

## Features
- Inspect Pods, Deployments, Services, and Namespaces
- Fetch pod logs and container events
- Multi-cluster support using local KUBECONFIG
- Safe read-only inspection defaults',
  'mcp-server',
  'https://github.com/containers/kubernetes-mcp-server',
  'containers',
  'Containers Org',
  ARRAY['kubernetes', 'k8s', 'mcp-server', 'cloud-native', 'devops'],
  850,
  false,
  'approved'
),

(
  'puppeteer-mcp',
  'Puppeteer MCP Server',
  'Headless browser automation server for rendering web pages, capturing screenshots, and executing E2E UI tests.',
  '## Overview

The official reference browser automation server for the Model Context Protocol, allowing Claude to interact with web interfaces.

## Features
- Render dynamic client-side JavaScript applications
- Capture viewport screenshots for multimodal agents
- Click, type, and navigate DOM elements
- Execute automated frontend regression tests',
  'mcp-server',
  'https://github.com/modelcontextprotocol/servers',
  'modelcontextprotocol',
  'Anthropic & Contributors',
  ARRAY['puppeteer', 'browser-automation', 'mcp-server', 'testing', 'scraping'],
  1900,
  false,
  'approved'
),

(
  'karpathy-claude-rules',
  'Karpathy Coding Principles (CLAUDE.md)',
  'Battle-tested CLAUDE.md behavioral guidelines codifying Andrej Karpathy''s 4 core LLM coding principles.',
  '## Overview

A viral behavioral instruction set based on Andrej Karpathy''s observations of common LLM coding pitfalls. Designed to prevent over-engineering and hallucinated refactoring.

## Core Principles
1. **Think Before Coding**: Surface assumptions, discuss trade-offs, and clarify ambiguity first.
2. **Simplicity First**: Implement the minimal viable solution without speculative abstractions.
3. **Surgical Changes**: Touch only necessary lines; respect existing code patterns without collateral edits.
4. **Goal-Driven Execution**: Work toward testable, verifiable completion criteria.',
  'config',
  'https://github.com/forrestchang/andrej-karpathy-skills',
  'forrestchang',
  'Forrest Chang',
  ARRAY['claude-md', 'guidelines', 'best-practices', 'karpathy', 'prompt-engineering'],
  1400,
  true,
  'approved'
),

(
  'cc-pr-tracker',
  'PR Tracker',
  'Pinned real-time terminal bar displaying pull request review statuses, approval counts, and merge readiness.',
  '## Overview

Track the lifecycle of your GitHub pull requests directly above your terminal prompt without switching contexts to the browser.

## Features
- Real-time review state monitoring (Approved, Changes Requested, Pending)
- Required check status counts
- Branch conflict warnings
- Toast notifications on new review comments',
  'mod',
  'https://github.com/aidojo/cc-pr-tracker',
  'aidojo',
  'AI Dojo',
  ARRAY['github', 'pull-requests', 'code-review', 'statusline', 'productivity', 'typescript'],
  145,
  false,
  'approved'
)

on conflict (slug) do nothing;

-- Ensure vote counts are correct
update public.mods m
set vote_count = coalesce((select count(*) from public.votes v where v.mod_id = m.id), 0);
