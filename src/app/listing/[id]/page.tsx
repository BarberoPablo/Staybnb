import BookingForm from "@/components/Booking/BookingForm";
import BookingModalTrigger from "@/components/Booking/BookingButton";
import { ImagesLayout } from "@/components/ImagesLayout";
import ImagesSlider from "@/components/ImagesSlider";
import { ListBadges } from "@/components/ListBadges";
import { listings } from "@/lib/mockListings";
import Image from "next/image";

interface ListingDetailsProps {
  params: {
    id: string;
  };
}

export default function ListingDetailsPage({ params }: ListingDetailsProps) {
  const { id } = params;
  const listingDetails = listings.find((listing) => listing.id === parseInt(id));

  if (!listingDetails) {
    return <div className="text-[26px] font-bold">Listing not found</div>;
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-[26px] font-bold">{listingDetails.title}</h1>
      {/* Desktop */}
      <div className="hidden sm:block">
        <ImagesLayout images={listingDetails.images} />
      </div>
      {/* Mobile */}
      <div className="block sm:hidden">
        <ImagesSlider images={listingDetails.images} />
      </div>

      <h2 className="text-[22px] font-medium">
        {listingDetails.type} in {listingDetails.location}
      </h2>

      <ListBadges badges={listingDetails.structure} className="text-[16px]" />

      <div>
        <span className="text-[17px] font-medium">⭐{listingDetails.score.value} ·</span>
        <span className="text-[16px] font-medium underline ">{listingDetails.score.reviews.length} reviews</span>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-7 sm:mr-30">
          <hr className="text-gray-300 my-8" />

          {/* Reserve button and modal for small screens */}
          <div className="block sm:hidden">
            <BookingModalTrigger listing={listingDetails} />
          </div>

          <div className="flex items-center">
            <Image src={listingDetails.host.avatarUrl} alt="Rounded avatar" height={40} width={40} className="rounded-full" />
            <h3>Hosted by {listingDetails.host.name}</h3>
          </div>

          <hr className="text-gray-300 my-8" />

          <p>{listingDetails.description}</p>
          <hr className="text-gray-300 my-8" />
        </div>

        {/* Reserve calendar for big screens */}
        <div className="hidden sm:flex justify-end lg:justify-center col-span-5">
          <BookingForm listing={listingDetails} />
        </div>
      </div>
    </div>
  );
}
