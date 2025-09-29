"use client";

import Image from "next/image";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { ImSpinner2 } from "react-icons/im";

export default function ImageWithFallback({
  src,
  alt,
  priority = false,
  fill = false,
  className,
  sizes,
  width,
  height,
  fallbackIcon,
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
  fallbackIcon?: React.ReactNode;
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error || !src) {
    return fallbackIcon ? fallbackIcon : <FallbackIcon fallbackIcon={fallbackIcon} />;
  }

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-2">
            <ImSpinner2 className="w-6 h-6 text-gray-400 animate-spin" />
            <span className="text-xs text-gray-400">Loading...</span>
          </div>
        </div>
      )}

      <Image
        src={src}
        alt={alt ?? "listing secondary image"}
        fill={fill}
        width={width}
        height={height}
        className={`${className ?? "object-cover"} transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        priority={priority}
        sizes={sizes ?? "(min-width: 640px) 25vw, (max-width: 639px) 0px"}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </>
  );
}

export function FallbackIcon({ fallbackIcon, className }: { fallbackIcon?: React.ReactNode; className?: string }) {
  return (
    <div className={`${className ?? "flex items-center justify-center h-full w-full bg-myGrayLight"}`}>
      {fallbackIcon ?? <CiImageOn className="w-8 h-8 text-myGrayDark" />}
    </div>
  );
}
