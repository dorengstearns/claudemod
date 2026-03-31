import { ModCardSkeleton } from '@/components/mods/ModCardSkeleton'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Skeleton header */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-muted rounded-md animate-pulse mb-2"></div>
        <div className="h-4 w-24 bg-muted rounded-md animate-pulse"></div>
      </div>

      {/* Skeleton Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="h-10 flex-1 bg-muted rounded-md animate-pulse"></div>
        <div className="h-10 w-full sm:w-[180px] bg-muted rounded-md animate-pulse"></div>
      </div>

      {/* Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ModCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
