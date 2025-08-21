export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      {/* Header with title and button */}
      <div className="flex items-center justify-between h-10">
        <div className="h-9 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 bg-myGreenExtraLight rounded-xl border border-myGreenSemiBold/20">
        {/* Avatar skeleton */}
        <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />

        {/* Name and member info skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-gray-200 animate-pulse mb-4" />

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse mb-2" />
              <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
            </div>

            {/* Last Name */}
            <div>
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse mb-2" />
              <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
            </div>

            {/* Bio */}
            <div>
              <div className="h-4 w-16 rounded bg-gray-200 animate-pulse mb-2" />
              <div className="h-20 w-full rounded-lg bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="space-y-4">
          <div className="h-6 w-32 rounded bg-gray-200 animate-pulse mb-4" />

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
