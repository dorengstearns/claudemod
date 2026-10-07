'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UnfurlFeedProps {
  children: React.ReactNode
  collapsedHeight?: string
  viewMoreLabel: string
  browseAllHref?: string
  browseAllLabel?: string
  defaultExpanded?: boolean
}

export function UnfurlFeed({
  children,
  collapsedHeight = 'max-h-[660px] sm:max-h-[740px]',
  viewMoreLabel,
  browseAllHref,
  browseAllLabel = 'Browse full directory',
  defaultExpanded = false,
}: UnfurlFeedProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [hasOverflow, setHasOverflow] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const threshold = typeof window !== 'undefined' && window.innerWidth < 640 ? 660 : 740
      const isOverflowing = contentRef.current.scrollHeight > threshold + 10
      setHasOverflow(isOverflowing)
    }
  }, [children])

  const handleCollapse = () => {
    setIsExpanded(false)
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      if (rect.top < 0) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Content wrapper with smooth height transition */}
      <div
        ref={contentRef}
        className={cn(
          'transition-[max-height] duration-700 ease-in-out overflow-hidden',
          isExpanded || !hasOverflow ? 'max-h-[5000px]' : collapsedHeight
        )}
      >
        {children}
      </div>

      {/* Opacity-gradient overlay and full-width horizontal 'View more' bar */}
      {!isExpanded && hasOverflow && (
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background from-25% via-background/80 to-transparent flex flex-col justify-end items-center pb-0 z-20 pointer-events-none">
          <div className="w-full pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-full group relative py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl border border-border/80 bg-background/90 dark:bg-card/90 backdrop-blur-md hover:bg-muted/80 hover:border-primary/50 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
            >
              <span>{viewMoreLabel}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Clean horizontal anchor bar when unfurled */}
      {isExpanded && (
        <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between gap-3 text-xs sm:text-sm">
          {browseAllHref && (
            <Link
              href={browseAllHref}
              className="text-primary hover:underline font-medium flex items-center gap-1.5 transition-colors truncate"
            >
              <span className="truncate">{browseAllLabel}</span> <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </Link>
          )}
          <button
            type="button"
            onClick={handleCollapse}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors shrink-0"
          >
            Show less <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
