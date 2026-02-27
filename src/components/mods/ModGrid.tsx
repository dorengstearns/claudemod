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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ModCardSkeleton key={i} />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mods.map((mod) => (
        <ModCard key={mod.id} mod={mod} />
      ))}
    </div>
  )
}
