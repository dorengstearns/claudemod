import { ModCard } from '@/components/mods/ModCard'
import { ModCardSkeleton } from '@/components/mods/ModCardSkeleton'
import type { Mod } from '@/types/mod'

interface ModGridProps {
  mods: Mod[]
  loading?: boolean
  skeletonCount?: number
}

export function ModGrid({ mods, loading = false, skeletonCount = 6 }: ModGridProps) {
  if (loading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <ModCardSkeleton />
          </div>
        ))}
      </div>
    )
  }

  if (mods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-lg mb-2">No mods found</p>
        <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {mods.map((mod) => (
        <div key={mod.id} className="break-inside-avoid mb-4">
          <ModCard mod={mod} />
        </div>
      ))}
    </div>
  )
}
