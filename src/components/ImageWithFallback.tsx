"use client";

import Image from "next/image";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";

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

  if (error || !src) {
    return fallbackIcon ? fallbackIcon : <FallbackIcon fallbackIcon={fallbackIcon} />;
  }

  return (
    <Image
      src={src}
      alt={alt ?? "listing secondary image"}
      fill={fill}
      width={width}
      height={height}
      className={className ?? "object-cover"}
      priority={priority}
      sizes={sizes ?? "(min-width: 640px) 25vw, (max-width: 639px) 0px"}
      onError={() => setError(true)}
    />
  );
}

export function FallbackIcon({ fallbackIcon, className }: { fallbackIcon?: React.ReactNode; className?: string }) {
  return (
    <div className={`${className ?? "flex items-center justify-center h-full w-full bg-myGrayLight"}`}>
      {fallbackIcon ?? <CiImageOn className="w-8 h-8 text-myGrayDark" />}
    </div>
  );
}
