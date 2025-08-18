export function SkeletonReservations() {
  return (
    <div className="space-y-6">
      {/* Header with title and description */}
      <div className="space-y-2">
        <div className="h-9 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-80 rounded bg-gray-200 animate-pulse" />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex-1 relative">
          <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
          <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {/* First Reservation Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image skeleton */}
            <div className="relative w-full lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 animate-pulse" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-64 rounded bg-gray-200 animate-pulse" />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                      <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                      <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-12 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <div className="h-9 w-24 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-9 w-20 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Second Reservation Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image skeleton */}
            <div className="relative w-full lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 animate-pulse" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-56 rounded bg-gray-200 animate-pulse" />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                      <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                      <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-12 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <div className="h-9 w-24 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-9 w-20 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Third Reservation Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image skeleton */}
            <div className="relative w-full lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 animate-pulse" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-52 rounded bg-gray-200 animate-pulse" />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                      <div className="h-4 w-30 rounded bg-gray-200 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                      <div className="h-4 w-22 rounded bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="h-6 w-28 rounded-full bg-gray-200 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-22 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-22 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-12 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-18 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <div className="h-9 w-24 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-9 w-20 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
