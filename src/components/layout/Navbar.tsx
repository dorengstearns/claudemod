'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { GitHubSignIn } from '@/components/shared/GitHubSignIn'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { useAuth } from '@/components/shared/AuthProvider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Plus, ChevronDown, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'

const emptySubscribe = () => () => {}
const getModifierSnapshot = () =>
  /Mac|iPod|iPhone|iPad/i.test(navigator.platform) ? '⌘' : 'Ctrl'
const getServerModifierSnapshot = () => '⌘'

const navLinks = [
  { href: '/browse', label: 'Browse' },
  { href: '/install', label: 'Install' },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const modifier = useSyncExternalStore(
    emptySubscribe,
    getModifierSnapshot,
    getServerModifierSnapshot
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto flex h-14 sm:h-15 max-w-6xl items-center gap-1 sm:gap-2.5 px-3 sm:px-4">
        {/* Mobile navigation menu (< md) */}
        <div className="md:hidden shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-1.5">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className={cn(
                      'w-full cursor-pointer text-sm font-medium',
                      pathname === link.href && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link
                  href="/#digest"
                  prefetch={false}
                  className="w-full cursor-pointer text-sm font-medium text-emerald-700 dark:text-emerald-400"
                >
                  Weekly Digest
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sponsor" prefetch={false} className="w-full cursor-pointer text-sm font-medium">
                  Sponsor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[13px] font-medium text-muted-foreground px-2 py-1">
                Categories
              </DropdownMenuLabel>
              {CATEGORIES.map((cat) => (
                <DropdownMenuItem key={cat.value} asChild>
                  <Link
                    href={`/browse?category=${cat.value}`}
                    prefetch={false}
                    className="flex items-center justify-between px-2 py-1.5 text-[13px] rounded-sm cursor-pointer w-full"
                  >
                    <span className="font-medium">{cat.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Distinct Brand Wordmark */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0 group">
          <Image src="/mascot.png" alt="" width={28} height={28} className="h-6 w-6 sm:h-7 sm:w-7" priority />
          <span className="text-base sm:text-lg font-bold tracking-[-0.025em] text-foreground">
            ClaudeMod
          </span>
        </Link>

        {/* Desktop Nav links (md+) */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-1 ml-4 shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-accent/70',
                pathname === link.href
                  ? 'text-foreground bg-accent/80'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-accent/70 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>Categories</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-1.5">
              {CATEGORIES.map((cat) => (
                <DropdownMenuItem key={cat.value} asChild>
                  <Link
                    href={`/browse?category=${cat.value}`}
                    prefetch={false}
                    className="flex items-center justify-between gap-3 px-2.5 py-1.5 text-[13px] rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors w-full"
                  >
                    <span className="font-medium shrink-0">{cat.label}</span>
                    <span className="text-[13px] text-muted-foreground truncate">
                      {cat.description}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Compact command palette trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
          onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
          title={`Quick search (${modifier}K)`}
          aria-label={`Quick search (${modifier}K)`}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Primary CTA: Submit a Mod */}
        <Link href="/submit" prefetch={false} className="shrink-0">
          <Button size="sm" className="h-8 sm:h-9 px-2.5 sm:px-3 gap-1 sm:gap-1.5 text-[13px] sm:text-sm font-medium cursor-pointer">
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span>Submit</span>
          </Button>
        </Link>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Auth */}
        {!loading && (
          user ? (
            <UserAvatar />
          ) : (
            <GitHubSignIn
              variant="outline"
              size="sm"
              label="Sign in"
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
            />
          )
        )}
      </div>
    </header>
  )
}
