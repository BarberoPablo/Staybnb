import { Guests } from "@/lib/types";
import { BiSolidBabyCarriage } from "react-icons/bi";
import { FaChild, FaPerson } from "react-icons/fa6";
import { IoIosPerson } from "react-icons/io";
import { MdOutlineChildCare, MdOutlinePets } from "react-icons/md";

export function ParseGuests(guests: Record<Guests, number>, id: string) {
  const guestIcons = {
    adults: { body: <FaPerson className="w-5 h-5" />, face: <IoIosPerson /> },
    children: { body: <FaChild className="w-4 h-4" />, face: <MdOutlineChildCare /> },
    infant: { body: <BiSolidBabyCarriage className="w-4 h-4" />, face: <BiSolidBabyCarriage /> }, //fa¿Baby
    pets: { body: <MdOutlinePets className="w-4 h-4" />, face: <MdOutlinePets /> },
  };
  return (
    <div className="flex gap-1">
      {Object.entries(guests).map(([guestType, count]) => (
        <div key={`${id}-${guestType}`} className={`flex justify-center items-center w-full`}>
          {count} {guestIcons[guestType as Guests].body}
        </div>
      ))}
    </div>
  );
}
