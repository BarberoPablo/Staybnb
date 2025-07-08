import { useListingForm } from "@/store/useListingForm";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { CiImageOn } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";

export function SortableImageGrid({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const images = useListingForm((state) => state.images);
  const setField = useListingForm((state) => state.setField);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.url === active.id);
      const newIndex = images.findIndex((img) => img.url === over?.id);
      const newArray = arrayMove(images, oldIndex, newIndex);
      setField("images", newArray);
    }
  };

  const handleRemove = (url: string) => {
    setField(
      "images",
      images.filter((image) => image.url !== url)
    );
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((img) => img.url)} strategy={rectSortingStrategy}>
        <div className="relative grid grid-cols-2 gap-4 w-full h-full">
          <div className="absolute top-4 left-4 z-10 px-2 py-0.5 bg-background rounded-md">
            <span className="text-sm">Cover photo</span>
          </div>

          {images.map((img, index) => (
            <div key={img.url} className={`relative group ${index === 0 ? "h-[300px] col-span-2" : "h-[200px] col-span-1"}`}>
              <SortableImage url={img.url} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(img.url);
                }}
                className="absolute top-1 right-1 z-10 bg-foreground text-background rounded-full px-2 py-2 text-xs shadow hover:bg-gray-900 transition"
              >
                <FaTrashAlt className="w-4 h-4" />
              </button>
            </div>
          ))}

          {Array.from({ length: 4 - images.length }).map((_, index) => (
            <div
              key={`placeholder-${index}-${images.length}`}
              role="button"
              className="flex items-center justify-center col-span-1 h-[200px] rounded-xl bg-gray-100 hover:cursor-pointer hover:border-gray-500 hover:border-2"
              onClick={() => setIsOpen(true)}
            >
              <CiImageOn className="w-8 h-8 text-gray-500" />
            </div>
          ))}
          <AddImage handleClick={() => setIsOpen(true)} />
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableImage({ url }: { url: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="relative w-full h-full rounded-xl bg-gray-100">
      <Image src={url} alt="Listing image" fill className="object-cover rounded-xl" />
    </div>
  );
}

function AddImage({ handleClick }: { handleClick: () => void }) {
  return (
    <div
      role="button"
      onClick={handleClick}
      className="flex flex-col items-center justify-center col-span-1 h-[200px] rounded-xl bg-gray-100 hover:cursor-pointer hover:border-gray-500 hover:border-2"
    >
      <IoAddSharp className="w-8 h-8 text-gray-500" />
      <p className="text-sm text-gray-500">Add more</p>
    </div>
  );
}
