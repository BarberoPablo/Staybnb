import ImageWithFallback from "@/components/ImageWithFallback";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CiImageOn } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";

export function SortableImageGrid({
  images,
  setIsOpen,
  setField,
}: {
  images: string[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setField: (field: string, value: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
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

          {images.map((img, index) => (
            <div key={img} className={`relative group ${index === 0 ? "h-[300px] col-span-2" : "h-[200px] col-span-1"}`}>
              <SortableImage url={img} resolution={index === 0 ? "1080" : "480"} />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(img);
                }}
                className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-2 text-xs shadow-lg hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100 hover:cursor-pointer"
              >
                <FaTrashAlt className="w-3 h-3" />
              </button>
            </div>
          ))}

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

function SortableImage({ url, resolution }: { url: string; resolution: "480" | "720" | "1080" }) {
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
      className="relative w-full h-full rounded-xl bg-myGreenExtraLight/30 hover:cursor-grab active:cursor-grabbing overflow-hidden hover:shadow-lg transition-shadow duration-200"
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
