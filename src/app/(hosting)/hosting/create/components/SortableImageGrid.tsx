import ImageWithFallback from "@/components/ImageWithFallback";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddSharp, IoChevronBack, IoChevronForward } from "react-icons/io5";

export function SortableImageGrid({
  images,
  setIsOpen,
  setField,
}: {
  images: string[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setField: (field: string, value: string[]) => void;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img === active.id);
      const newIndex = images.findIndex((img) => img === over?.id);
      const newArray = arrayMove(images, oldIndex, newIndex);
      setField("images", newArray);
    }
  };

  const handleMoveImage = (currentIndex: number, direction: number) => {
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < images.length) {
      setAnimatingIndex(currentIndex);

      setTimeout(() => {
        const newArray = arrayMove(images, currentIndex, newIndex);
        setField("images", newArray);

        setTimeout(() => {
          setAnimatingIndex(null);
        }, 300);
      }, 150);
    }
  };

  const handleRemove = (url: string) => {
    setField(
      "images",
      images.filter((image) => image !== url)
    );
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((img) => img)} strategy={rectSortingStrategy}>
        <div className="relative grid grid-cols-2 gap-4 w-full h-full">
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-white backdrop-blur-sm rounded-lg shadow-sm border border-myGray/20">
            <span className="text-sm font-medium text-myGrayDark">Cover photo</span>
          </div>

          <AnimatePresence mode="popLayout">
            {images.map((img, index) => (
              <motion.div
                key={img}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: animatingIndex === index ? 1.05 : 1,
                  boxShadow: animatingIndex === index ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.3,
                }}
                className={`relative group ${index === 0 ? "h-[300px] col-span-2" : "h-[200px] col-span-1"}`}
              >
                <SortableImage url={img} resolution={index === 0 ? "1080" : "480"} isMobile={isMobile} />

                {/* Mobile arrow buttons */}
                {isMobile && (
                  <div className="inset-0 flex items-center justify-between pointer-events-none">
                    {/* Left arrow */}
                    {index > 0 && (
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveImage(index, -1);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          scale: animatingIndex === index ? 1.1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-auto ml-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                      >
                        <IoChevronBack className="w-4 h-4" />
                      </motion.button>
                    )}

                    {/* Right arrow */}
                    {index < images.length - 1 && (
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveImage(index, 1);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          scale: animatingIndex === index ? 1.1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-auto mr-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                      >
                        <IoChevronForward className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Delete button */}
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(img);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-2 text-xs shadow-lg hover:bg-red-600 transition-colors duration-200 hover:cursor-pointer ${
                    isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <FaTrashAlt className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {Array.from({ length: 4 - images.length }).map((_, index) => (
            <div
              key={`placeholder-${index}-${images.length}`}
              role="button"
              className="flex items-center justify-center col-span-1 h-[200px] rounded-xl bg-myGreenExtraLight/30 border-2 border-dashed border-myGray/30 hover:border-myGreenSemiBold hover:bg-myGreenExtraLight/50 transition-all duration-200 hover:cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <CiImageOn className="w-8 h-8 text-myGray" />
            </div>
          ))}
          <AddImage handleClick={() => setIsOpen(true)} />
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableImage({ url, resolution, isMobile }: { url: string; resolution: "480" | "720" | "1080"; isMobile: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`relative w-full h-full rounded-xl bg-myGreenExtraLight/30 overflow-hidden hover:shadow-lg transition-shadow duration-200 ${
        isMobile ? "cursor-default" : "hover:cursor-grab active:cursor-grabbing"
      }`}
    >
      <ImageWithFallback src={url + `&w=${resolution}`} alt={`listing secondary image`} priority fill className="object-cover" sizes="100%" />
    </div>
  );
}

function AddImage({ handleClick }: { handleClick: () => void }) {
  return (
    <div
      role="button"
      onClick={handleClick}
      className="flex flex-col items-center justify-center col-span-1 h-[200px] rounded-xl bg-myGreenExtraLight/30 border-2 border-dashed border-myGray/30 hover:border-myGreenSemiBold hover:bg-myGreenExtraLight/50 transition-all duration-200 hover:cursor-pointer"
    >
      <IoAddSharp className="w-8 h-8 text-myGray mb-2" />
      <p className="text-sm font-medium text-myGray">Add more</p>
    </div>
  );
}
