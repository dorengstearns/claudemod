import { ChevronDown, HelpCircle, Sparkles, BookOpen } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: 'What are Claude Code Mods?',
    answer: (
      <>
        <p className="mb-2">
          Introduced in <strong>Claude Code 2.1.287+</strong> (October 2026), <strong>Mods</strong> are in-process TypeScript and JavaScript plugins that extend and customize the behavior of the Claude Code terminal agent.
        </p>
        <p>
          Unlike external tools or passive prompt files, Mods execute directly within the Claude Code runtime process. This allows them to hook into the agent lifecycle to dynamically rewrite prompts, inspect or block tool calls, redact sensitive information, and render custom terminal user interfaces (such as live split panes, cost meters, and subagent status graphs).
        </p>
      </>
    ),
  },
  {
    question: 'How do Mods differ from Skills, Hooks, and MCP Servers?',
    answer: (
      <div className="space-y-2.5">
        <p>
          Claude Code extensions are organized into distinct layers, each serving a specific purpose:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
          <li>
            <strong>Mods (In-Process Plugins):</strong> TypeScript code running inside Claude Code memory. Can intercept events, alter prompt pipelines, and draw terminal UI panes.
          </li>
          <li>
            <strong>Skills:</strong> Markdown instruction files that teach Claude domain-specific workflows, slash command shortcuts, and behavioral rules.
          </li>
          <li>
            <strong>Settings Hooks:</strong> External scripts or shell commands executed outside the agent to enforce deterministic guardrails (e.g. running a linter after edits).
          </li>
          <li>
            <strong>MCP Servers:</strong> Model Context Protocol servers connecting Claude Code to external services, APIs, databases, and third-party tools.
          </li>
          <li>
            <strong>Plugins:</strong> The distribution package format capable of bundling Mods, Skills, Hooks, and MCP configs into a single installable unit.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: 'How do I install and run a Claude Code Mod?',
    answer: (
      <div className="space-y-2">
        <p>
          To use Mods, make sure you are running <strong>Claude Code version 2.1.287 or later</strong>. Mods are enabled by default and require no special feature flags.
        </p>
        <p>
          For local development and testing, you can load a mod directory using:
        </p>
        <pre className="bg-muted p-2.5 rounded-md font-mono text-xs overflow-x-auto text-foreground">
          claude --plugin-dir ./path/to/mod
        </pre>
        <p>
          You can validate plugin structure and permissions before loading by running <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">claude plugin validate</code>.
        </p>
      </div>
    ),
  },
  {
    question: 'How do developers build custom Claude Code Mods?',
    answer: (
      <div className="space-y-2">
        <p>
          Mods are authored in TypeScript. A mod exports a primary <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">register(on, options)</code> lifecycle hook:
        </p>
        <pre className="bg-muted p-2.5 rounded-md font-mono text-xs overflow-x-auto text-foreground">
{`export function register(on) {
  on('UserPromptSubmit', async (event) => {
    // Inspect or rewrite user prompts before they reach the model
  });

  on('PreToolUse', async (event) => {
    // Intercept, audit, or confirm tool calls before execution
  });
}`}
        </pre>
        <p>
          Official type definitions are provided in <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">claude-code/mods/types/claude-code.d.ts</code> to support typed development with auto-completion.
        </p>
      </div>
    ),
  },
  {
    question: 'Are community Claude Code Mods safe to install?',
    answer: (
      <>
        <p className="mb-2">
          Because Mods run in-process with the same operating system permissions as your terminal and user account, it is critical to only install mods from trusted creators.
        </p>
        <p>
          Always review the source repository and verify what resources a mod accesses (e.g. file system read/write, child processes, or outbound network calls). ClaudeMod provides direct links to the source GitHub repositories and community star counts for full transparency.
        </p>
      </>
    ),
  },
  {
    question: 'How do I submit my Mod or MCP server to ClaudeMod?',
    answer: (
      <>
        <p className="mb-2">
          ClaudeMod is community-driven! You can submit any public GitHub repository containing a Claude Code Mod, Skill, Hook, or MCP configuration.
        </p>
        <p>
          Simply click the <strong>Submit a Mod</strong> button in the navigation bar, paste your repository URL, select the appropriate category tag, and submit. Once verified, your mod will be cataloged and discoverable by thousands of developers.
        </p>
      </>
    ),
  },
]

export function FaqSection() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof item.answer === 'string' ? item.answer : item.question,
      },
    })),
  }

  return (
    <section className="pb-16 border-t pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Claude Code 2.1.287+ Guide</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Frequently Asked Questions: Understanding Claude Code Mods
          </h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about Anthropic's new in-process plugin architecture and the extensible Claude Code ecosystem.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={index}
              className="group border border-border/80 rounded-lg bg-card/60 transition-all open:bg-card open:shadow-xs"
            >
              <summary className="flex items-center justify-between p-4 text-sm font-semibold cursor-pointer list-none select-none hover:text-primary transition-colors">
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 group-open:text-emerald-500 transition-colors" />
                  <span>{item.question}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
