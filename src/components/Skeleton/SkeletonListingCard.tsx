export function SkeletonListingCard() {
  return (
    <div className="flex relative justify-center w-60 h-60 rounded-4xl overflow-hidden bg-gray-300 animate-pulse">
      {/* Iconos de acción simulados */}
      <div className="absolute flex flex-col gap-2 top-2 right-2">
        <div className="p-3 border-2 border-gray-400 rounded-full bg-gray-400 opacity-50"></div>
        <div className="p-3 border-2 border-gray-400 rounded-full bg-gray-400 opacity-50"></div>
      </div>
    </div>
  );
}
