'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { GitHubSignIn } from '@/components/shared/GitHubSignIn'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { useAuth } from '@/components/shared/AuthProvider'
import { Button } from '@/components/ui/button'
import { Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/browse', label: 'Browse' },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const [modifier, setModifier] = useState('⌘')

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isMac = /Mac|iPod|iPhone|iPad/i.test(navigator.platform)
      setModifier(isMac ? '⌘' : 'Ctrl')
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/mascot.png" alt="" width={28} height={28} />
          <span>ClaudeMod</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 ml-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-accent',
                pathname === link.href
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 text-muted-foreground hidden sm:flex items-center group relative overflow-hidden transition-all hover:bg-accent hover:text-accent-foreground"
          onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
        >
          <Search className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
          <span className="text-xs">Search mods...</span>
          <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 ml-2">
            <span className="text-xs">{modifier}</span>K
          </kbd>
        </Button>

        {/* Submit */}
        {user && (
          <Link href="/submit">
            <Button size="sm" variant="outline" className="gap-1.5 hidden sm:flex">
              <Plus className="h-4 w-4" />
              Submit
            </Button>
          </Link>
        )}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Auth */}
        {!loading && (
          user ? (
            <UserAvatar />
          ) : (
            <GitHubSignIn variant="outline" size="sm" label="Sign in" />
          )
        )}
      </div>
    </header>
  )
}
