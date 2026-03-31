-- Add Handpicked Mods

insert into public.mods (
  slug, name, description, long_description, category,
  github_url, author_github, author_name,
  tags, github_stars, is_featured, status
) values

(
  'claude-code-video-toolkit',
  'Claude Code Video Toolkit',
  'AI-native video production toolkit for Claude Code by DigitalSamba. Programmatically generate and orchestrate video.',
  '## Overview

AI-native video production toolkit for Claude Code by DigitalSamba. This toolkit enables Claude Code to programmatically interact with video processing, generation, and orchestration pipelines directly via the Claude Code CLI.

## Features

- Interacts with video workflows
- Generates, edits, and processes videos
- Seamless integration natively as a skill',
  'skill',
  'https://github.com/digitalsamba/claude-code-video-toolkit',
  'digitalsamba',
  'DigitalSamba',
  ARRAY['video', 'toolkit', 'digitalsamba', 'editing'],
  12,
  false,
  'approved'
),

(
  'taste-skill',
  'Taste-Skill',
  'High-agency frontend skill that gives your AI good taste, stopping it from generating generic UI slop.',
  '## Overview

Taste-Skill gives your AI good taste. It prevents the AI from generating boring, generic, ''slop'' and pushes it to build high-agency, aesthetically pleasing frontend interfaces.

## Features

- Avoids generic bootstrap-style slop
- Enforces strict styling guidelines
- Promotes opinionated, modern frontend design',
  'skill',
  'https://github.com/Leonxlnx/taste-skill',
  'Leonxlnx',
  'Leonxlnx',
  ARRAY['frontend', 'ui', 'design', 'taste', 'react'],
  85,
  true,
  'approved'
),

(
  'notebooklm-skill',
  'NotebookLM Skill',
  'Enable Claude Code to query your Google NotebookLM documents for source-grounded answers.',
  '## Overview

Use this skill to enable Claude Code to communicate directly with your Google NotebookLM notebooks. Query your uploaded documents and get source-grounded, citation-backed answers powered by Gemini.

## Features

- **Browser Automation:** Communicates seamlessly with your NotebookLM sessions.
- **Authentication:** Persistent authentication capabilities.
- **Private Knowledge Base:** Answers are sourced exclusively from your own documents.',
  'skill',
  'https://github.com/PleasePrompto/notebooklm-skill',
  'PleasePrompto',
  'PleasePrompto',
  ARRAY['notebooklm', 'gemini', 'rag', 'knowledge', 'docs'],
  105,
  false,
  'approved'
),

(
  'cship',
  'cship',
  'Beautiful, blazing-fast, customizable status line for Claude Code with full Starship pass-through.',
  '## Overview

`cship` is a blazing-fast, highly customizable status line for Claude Code that integrates full Starship pass-through. It replaces the default status line with a much more powerful and aesthetically pleasing visualization.

## Features

- **Starship Pass-through:** Uses Starship underneath for ultimate terminal prompt customization.
- **Blazing Fast:** Built for speed with unnoticeable overhead.
- **Metrics:** Automatically hooks into usage metrics for real-time tracking.',
  'plugin',
  'https://github.com/stephenleo/cship',
  'stephenleo',
  'stephenleo',
  ARRAY['status-line', 'cli', 'starship', 'ui', 'terminal'],
  210,
  true,
  'approved'
),

(
  'claudeline',
  'claudeline',
  'Customizable status line for Claude Code featuring git integration, cost tracking, and theming.',
  '## Overview

A beautifully crafted, customizable status line plugin for Claude Code. `claudeline` adds comprehensive telemetry to your CLI, such as real-time cost tracking, active git branch, themes, and granular usage monitoring.

## Features

- **Cost Tracking:** Monitor your token usage in real-time.
- **Git Integration:** View current branch and dirtiness instantly.
- **Theming:** Full color and theme support for terminal output.',
  'plugin',
  'https://github.com/lucasilverentand/claudeline',
  'lucasilverentand',
  'Luca Silverentand',
  ARRAY['status-line', 'cli', 'git', 'cost-tracking', 'theme'],
  340,
  true,
  'approved'
),

(
  'claude-status',
  'claude-status',
  'Minimalist CLI status line showing real-time token usage and costs for the current session and week.',
  '## Overview

`claude-status` is a lightweight status line injection for the Claude Code CLI. Its primary focus is to show token usage and total session/weekly costs persistently so you don''t encounter billing surprises.

## Features

- Tracks current session usage
- Tracks rolling weekly token usage
- Extremely minimal and lightweight',
  'plugin',
  'https://github.com/rockia/claude-status',
  'rockia',
  'rockia',
  ARRAY['status-line', 'cli', 'monitoring', 'minimal'],
  55,
  false,
  'approved'
),

(
  'harnss',
  'harnss',
  'Desktop client to harness Claude Code, Codex, and other ACP agents with rich UI and tool visualization.',
  '## Overview

Harnss is a powerful open-source desktop UI client designed to harness Claude Code, Codex, and any other agent accepting the Agent Client Protocol (ACP). Run multiple AI coding agents side-by-side with rich visualization, MCP integrations, an embedded terminal, git, and a built-in browser.

## Features

- **Rich Tool Visualization:** Tool calls render as interactive UI cards instead of raw JSON logs.
- **Multi-engine Sessions:** Switch instantly between Claude Code, Codex, or Gemini.
- **Embedded Environment:** Includes an integrated terminal and browser.',
  'harness',
  'https://github.com/OpenSource03/harnss',
  'OpenSource03',
  'OpenSource03',
  ARRAY['desktop', 'gui', 'acp', 'visualization', 'harness', 'terminal'],
  159,
  true,
  'approved'
);

-- Ensure vote counts are correct (safety measure)
update public.mods m
set vote_count = coalesce((select count(*) from public.votes v where v.mod_id = m.id), 0);
