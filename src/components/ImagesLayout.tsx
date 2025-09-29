import ImageWithFallback, { FallbackIcon } from "./ImageWithFallback";

/* Renders 5 images max */
export function ImagesLayout({ images }: { images: string[] }) {
  const sideImages = images.slice(1, 5);
  const imageHorizontalSpace = sideImages.length > 2 ? "col-span-1" : "col-span-2";
  const imageVerticalSpace = sideImages.length === 1 ? "row-span-2" : "row-span-1";

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] rounded-xl overflow-hidden">
      <div className="col-span-2 row-span-2 relative h-full w-full">
        {images[0] ? (
          <ImageWithFallback src={images[0] + "&w=720"} alt="listing main image" priority fill className="object-cover" sizes="100%" />
        ) : (
          <FallbackIcon />
        )}
      </div>

      {sideImages.map((image) => (
        <div key={image} className={`${imageHorizontalSpace} ${imageVerticalSpace} relative h-full w-full`}>
          {image ? (
            <ImageWithFallback src={image + "&w=480"} alt={`listing secondary image`} priority fill className="object-cover" sizes="100%" />
          ) : (
            <FallbackIcon />
          )}
        </div>
      ))}
    </div>
  );
}
