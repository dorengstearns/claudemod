import Link from 'next/link'
import { Package } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-3">
              <Package className="h-5 w-5 text-primary" />
              <span>ClaudeMod</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The home for Claude Code modifications — skills, MCP servers, agents, and more.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.value}>
                  <Link
                    href={`/browse?category=${cat.value}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">&nbsp;</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(4).map((cat) => (
                <li key={cat.value}>
                  <Link
                    href={`/browse?category=${cat.value}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Submit a Mod
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/anthropics/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Claude Code Docs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ClaudeMod. Community-maintained.
          </p>
          <p className="text-xs text-muted-foreground">
            Not affiliated with Anthropic.
          </p>
        </div>
      </div>
    </footer>
  )
}
