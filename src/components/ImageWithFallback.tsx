"use client";

import Image from "next/image";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";

export default function ImageWithFallback({
  src,
  alt,
  priority = true,
  fill = true,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
  sizes: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return <FallbackIcon />;
  }

  return (
    <Image
      src={src}
      alt={alt ?? "listing secondary image"}
      fill={fill}
      className={className ?? "object-cover"}
      priority={priority}
      sizes={sizes ?? "(min-width: 640px) 25vw, (max-width: 639px) 0px"}
      onError={() => setError(true)}
    />
  );
}

export function FallbackIcon() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-myGrayLight ">
      <CiImageOn className="w-8 h-8 text-myGrayDark" />
    </div>
  );
}
