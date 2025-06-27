import { Guests } from "@/lib/types";
import { displayGuestLabel } from "@/lib/utils";
import Image from "next/image";
import { ListingData } from "./Checkout";
import ListingPrice from "@/components/ListingPrice";

export default function ListingResume({
  listingData,
  setListingData,
}: {
  listingData: ListingData;
  setListingData: React.Dispatch<React.SetStateAction<ListingData>>;
}) {
  const handleChangeDates = () => {
    //open a modal component and keep this as server component
  };

  return (
    <div className="w-full h-full p-8 border border-gray-300">
      <div className="flex gap-4">
        <Image
          src={listingData.listing.images[0]}
          alt="listing main image"
          className="object-cover w-[200px] h-[200px] sm:w-[100px] sm:h-[100px] rounded-xl"
          width={200}
          height={200}
          sizes="(max-width: 640px) 200px, 100px"
        />
        <div className="flex flex-col">
          <h2>{listingData.listing.title}</h2>
          <h3>
            ⭐{listingData.listing.score.value} ({listingData.listing.score.reviews.length})
          </h3>
        </div>
      </div>

      <hr className="text-gray-300 my-4" />

      <div className="flex flex-col">
        <h2>Trip information</h2>
        <div className="flex">
          <span>
            {listingData.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
            {listingData.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <button onClick={handleChangeDates}>Change</button>
        </div>
        {Object.entries(listingData.guests).map(([guest, value]) => (
          <span key={guest}>{displayGuestLabel(guest as Guests, Number(value))}</span>
        ))}
      </div>

      <hr className="text-gray-300 my-4" />

      <div className="flex flex-col">
        <h2>Price details</h2>
        <ListingPrice summary={listingData.summary} listing={listingData.listing} />
      </div>
    </div>
  );
}
