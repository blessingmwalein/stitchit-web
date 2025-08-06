import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="relative min-w-[300px] overflow-hidden rounded-2xl bg-gray-100 shadow-sm dark:bg-gray-800">
      <div className="aspect-square overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      
      <div className="p-4">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-4 h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function ProductCarouselSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-8 pt-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
} 