import BookingCalendarContainer from "@/components/Booking/BookingCalendarContainer";
import { ImagesLayout } from "@/components/ImagesLayout";
import ImagesSlider from "@/components/ImagesSlider";
import { ListBadges } from "@/components/ListBadges";
import { mockListings } from "@/lib/mockListings";
import type { Host, Listing } from "@/lib/types";
import Image from "next/image";

interface ListingDetailsProps {
  params: {
    id: string;
  };
}

export default function ListingDetailsPage({ params }: ListingDetailsProps) {
  const { id } = params;
  const listingDetails = mockListings.find((listing) => listing.id === parseInt(id));

  if (!listingDetails) {
    return <div className="text-[26px] font-bold">Listing not found</div>;
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-[26px] font-bold">{listingDetails.title}</h1>

      <div className="hidden sm:block">
        <ImagesLayout images={listingDetails.images} />
      </div>
      <div className="block sm:hidden">
        <ImagesSlider images={listingDetails.images} />
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-7 sm:mr-30">
          <ListingSubtitle listingDetails={listingDetails} />

          <hr className="text-gray-300 my-8" />

          <HostInformation host={listingDetails.host} />

          <hr className="text-gray-300 my-8" />

          <p>{listingDetails.description}</p>

          <hr className="text-gray-300 my-8" />
        </div>

        <BookingCalendarContainer listing={listingDetails} />
      </div>
    </div>
  );
}

function HostInformation({ host }: { host: Host }) {
  return (
    <div className="flex items-center">
      <Image src={host.avatarUrl} alt="Rounded avatar" height={40} width={40} className="rounded-full" />
      <h3>Hosted by {host.name}</h3>
    </div>
  );
}

function ListingSubtitle({ listingDetails }: { listingDetails: Listing }) {
  return (
    <div>
      <h2 className="text-[22px] font-medium">
        {listingDetails.type} in {listingDetails.location}
      </h2>
      <ListBadges badges={listingDetails.structure} className="text-[16px]" />
      <div>
        <span className="text-[17px] font-medium">⭐{listingDetails.score.value} ·</span>
        <span className="text-[16px] font-medium underline ">{listingDetails.score.reviews.length} reviews</span>
      </div>
    </div>
  );
}
