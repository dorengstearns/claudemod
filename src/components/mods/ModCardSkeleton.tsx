import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ModCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <Skeleton className="h-5 w-16 mb-2" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <Skeleton className="h-8 w-14" />
        </div>
        <Skeleton className="h-4 w-full mb-1.5" />
        <Skeleton className="h-4 w-4/5 mb-3" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-4 pt-0">
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  )
}
