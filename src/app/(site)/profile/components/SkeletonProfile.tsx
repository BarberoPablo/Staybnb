export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      {/* Header with title and button */}
      <div className="flex items-center justify-between h-10">
        <div className="h-9 w-48 sm:w-64 rounded bg-gray-200 animate-pulse" />
        <div className="h-10 w-24 sm:w-32 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-4 sm:gap-6 py-6 sm:p-6 bg-myGreenExtraLight rounded-xl border border-myGreenSemiBold/20">
        {/* Avatar skeleton */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />

        {/* Name and member info skeleton */}
        <div className="space-y-2 min-w-0 flex-1">
          <div className="h-6 sm:h-7 w-32 sm:w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 sm:h-5 w-24 sm:w-32 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="h-6 w-32 sm:w-40 rounded bg-gray-200 animate-pulse mb-4" />

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <div className="h-4 w-16 sm:w-20 rounded bg-gray-200 animate-pulse mb-2" />
              <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
            </div>

            {/* Last Name */}
            <div>
              <div className="h-4 w-16 sm:w-20 rounded bg-gray-200 animate-pulse mb-2" />
              <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
            </div>

            {/* Bio */}
            <div>
              <div className="h-4 w-12 sm:w-16 rounded bg-gray-200 animate-pulse mb-2" />
              <div className="h-16 sm:h-20 w-full rounded-lg bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="space-y-4">
          <div className="h-6 w-28 sm:w-32 rounded bg-gray-200 animate-pulse mb-4" />

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 rounded bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="h-4 w-10 sm:w-12 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 sm:w-32 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 rounded bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="h-4 w-10 sm:w-12 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-16 sm:w-20 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
