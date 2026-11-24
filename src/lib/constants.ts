export const CATEGORIES = [
  {
    value: 'mod' as const,
    label: 'Mods',
    icon: 'Boxes',
    description: 'In-process TypeScript UI & lifecycle plugins',
    color: 'text-emerald-500',
  },
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
  { value: 'stars', label: 'Most Stars' },
  { value: 'newest', label: 'Newest' },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]['value']

export const MOD_SUBCATEGORIES = [
  { value: 'dashboards' as const, label: 'Dashboards', description: 'Usage meters, status bars, monitors & panels' },
  { value: 'interface' as const, label: 'Interface', description: 'Panes, themes, rendering & UI upgrades' },
  { value: 'context-memory' as const, label: 'Context & Memory', description: 'Compaction, caching, handoffs & notes' },
  { value: 'automation' as const, label: 'Automation', description: 'Routing, orchestration, alerts & workflows' },
  { value: 'security' as const, label: 'Security', description: 'Guards, firewalls, redaction & blast-radius checks' },
  { value: 'while-you-wait' as const, label: 'While You Wait', description: 'Pets, companions, ambient scenes & fun' },
  { value: 'games' as const, label: 'Games', description: 'Playable terminal games while Claude works' },
] as const

export type ModSubcategoryValue = (typeof MOD_SUBCATEGORIES)[number]['value']

export const PERMISSION_LEVELS = {
  'ui-only': {
    label: 'UI Only',
    shortLabel: 'UI Only',
    description: 'Draws UI elements or stores local mod state only. No filesystem, shell, or network access detected.',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    dotClass: 'bg-emerald-500',
  },
  reads: {
    label: 'Reads Local Data',
    shortLabel: 'Reads Files',
    description: 'Reads local project files, settings, transcripts, or environment variables.',
    badgeClass: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25',
    dotClass: 'bg-sky-500',
  },
  'writes-or-runs': {
    label: 'Writes / Shell',
    shortLabel: 'Writes / Shell',
    description: 'Writes files, executes local shell processes, or programmatically drives Claude.',
    badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    dotClass: 'bg-amber-500',
  },
  network: {
    label: 'Network / External',
    shortLabel: 'Network',
    description: 'Makes outbound network requests, calls MCP servers, or requests auth handles.',
    badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
    dotClass: 'bg-rose-500',
  },
  unknown: {
    label: 'Unscanned',
    shortLabel: 'Unscanned',
    description: 'Static permission footprint not yet scanned. Inspect with claude plugin validate before installing.',
    badgeClass: 'bg-muted text-muted-foreground border-border',
    dotClass: 'bg-muted-foreground/60',
  },
} as const

export type PermissionLevel = keyof typeof PERMISSION_LEVELS

export const SURFACES = [
  { value: 'terminal' as const, label: 'Terminal' },
  { value: 'desktop' as const, label: 'Desktop' },
  { value: 'mobile' as const, label: 'Mobile' },
] as const

export const PAGE_SIZE = 24

export const SITE_NAME = 'ClaudeMod'
export const SITE_DESCRIPTION =
  'The community hub for Claude Code Mods — in-process TypeScript plugins, skills, MCP servers, hooks, and more.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.claudemod.com'
