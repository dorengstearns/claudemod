export const CATEGORIES = [
  {
    value: 'skill' as const,
    label: 'Skills',
    icon: 'Workflow',
    description: 'Markdown workflow automations',
    color: 'text-blue-500',
  },
  {
    value: 'mcp-server' as const,
    label: 'MCP Servers',
    icon: 'Plug',
    description: 'Tool integrations via MCP protocol',
    color: 'text-purple-500',
  },
  {
    value: 'command' as const,
    label: 'Commands',
    icon: 'Terminal',
    description: 'Slash command definitions',
    color: 'text-green-500',
  },
  {
    value: 'agent' as const,
    label: 'Agents',
    icon: 'Bot',
    description: 'Subagent role definitions',
    color: 'text-yellow-500',
  },
  {
    value: 'harness' as const,
    label: 'Harnesses',
    icon: 'Layers',
    description: 'Full agentic frameworks',
    color: 'text-red-500',
  },
  {
    value: 'hook' as const,
    label: 'Hooks',
    icon: 'Zap',
    description: 'Event-driven trigger automations',
    color: 'text-orange-500',
  },
  {
    value: 'plugin' as const,
    label: 'Plugins',
    icon: 'Package',
    description: 'Bundled multi-feature packages',
    color: 'text-pink-500',
  },
  {
    value: 'config' as const,
    label: 'Configs',
    icon: 'FileText',
    description: 'CLAUDE.md configuration files',
    color: 'text-cyan-500',
  },
  {
    value: 'ide-plugin' as const,
    label: 'IDE Plugins',
    icon: 'Code2',
    description: 'VS Code, Neovim, JetBrains integrations',
    color: 'text-indigo-500',
  },
] as const

export type CategoryValue = (typeof CATEGORIES)[number]['value']

export const SORT_OPTIONS = [
  { value: 'votes', label: 'Most Voted' },
  { value: 'newest', label: 'Newest' },
  { value: 'stars', label: 'GitHub Stars' },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]['value']

export const PAGE_SIZE = 24

export const SITE_NAME = 'ClaudeMod'
export const SITE_DESCRIPTION =
  'Discover, share, and install Claude Code modifications — skills, MCP servers, agents, harnesses, and more.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://claudemod.com'
