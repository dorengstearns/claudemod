'use client'

import { useState } from 'react'

interface ModThumbnailProps {
  src: string
  alt: string
}

export function ModThumbnail({ src, alt }: ModThumbnailProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return null
  }

  return (
    <div className="relative w-full h-36 bg-muted/25 dark:bg-muted/15 overflow-hidden border-b border-border/40 shrink-0 pointer-events-none">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
  )
}
