import Image from "next/image";
import ImageWithFallback, { FallbackIcon } from "./ImageWithFallback";

/* Renders 5 images max */
export function ImagesLayout({ images }: { images: string[] }) {
  const sideImages = images.slice(1, 5);
  const imageHorizontalSpace = sideImages.length > 2 ? "col-span-1" : "col-span-2";
  const imageVerticalSpace = sideImages.length === 1 ? "row-span-2" : "row-span-1";

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] rounded-xl overflow-hidden">
      <div className="col-span-2 row-span-2 relative h-full w-full">
        <Image src={images[0]} alt="listing main image" priority fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
      </div>

      {sideImages.map((image) => (
        <div key={image} className={`${imageHorizontalSpace} ${imageVerticalSpace} relative h-full w-full`}>
          {image ? (
            <ImageWithFallback
              src={image}
              alt={`listing secondary image`}
              priority
              fill
              className="object-cover"
              sizes="(min-width: 640px) 25vw, (max-width: 639px) 0px"
            />
          ) : (
            <FallbackIcon />
          )}
        </div>
      ))}
    </div>
  );
}
