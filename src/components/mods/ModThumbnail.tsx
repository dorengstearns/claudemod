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
    <div className="relative w-full aspect-[16/9] bg-muted/25 dark:bg-muted/15 flex items-center justify-center overflow-hidden border-b border-border/40 shrink-0 pointer-events-none p-2.5">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02]"
      />
    </div>
  )
}
