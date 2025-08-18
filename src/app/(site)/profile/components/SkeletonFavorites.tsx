export function SkeletonFavorites() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="h-9 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-80 rounded bg-gray-200 animate-pulse mt-2" />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="w-full h-12 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Image skeleton */}
            <div className="relative h-48 bg-gray-200 animate-pulse" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Title and location */}
              <div>
                <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse mb-2" />
                <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <div className="flex-1 h-10 rounded-lg bg-gray-200 animate-pulse" />
                <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats skeleton */}
      <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-5 w-32 rounded bg-gray-200 animate-pulse mb-2" />
            <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="text-right">
            <div className="h-8 w-12 rounded bg-gray-200 animate-pulse mb-1" />
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
