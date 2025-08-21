import BookingCalendarContainer from "@/components/Booking/BookingCalendarContainer";
import { ImagesLayout } from "@/components/ImagesLayout";
import ImagesSlider from "@/components/ImagesSlider";
import { ListBadges } from "@/components/ListBadges";
import { api } from "@/lib/api/api";
import { Listing } from "@/lib/types/listing";
import { notFound } from "next/navigation";
import { IoLocation, IoStar } from "react-icons/io5";
import { Container } from "../../components/Container";

type ListingDetailsProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailsPage({ params }: ListingDetailsProps) {
  const { id } = await params;

  let listing;
  try {
    listing = await api.getListing(Number(id));
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <Container noPadding className="min-h-screen w-full bg-gray-50 flex flex-col mx-auto px-2 sm:px-6 py-8 gap-4">
      {/* Hero Section with Images */}
      <div className="relative">
        <div className="hidden lg:block">
          <ImagesLayout images={listing.images} />
        </div>
        <div className="grid relative lg:hidden">
          <ImagesSlider images={listing.images} hoverEffect={true} containerClassName="rounded-t-xl" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Listing Details */}
          <div className="lg:col-span-7 space-y-8 border border-gray-200 rounded-2xl shadow-lg p-6">
            {/* Listing Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-myGrayDark leading-tight">{listing.title}</h1>
              <ListingSubtitle listingDetails={listing} />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Host Information - Placeholder for future implementation */}
            {/* <HostInformation host={listingDetails.host} /> */}

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-myGrayDark">About this place</h3>
              <p className="text-myGray leading-relaxed text-lg">{listing.description}</p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>
          </div>

          {/* Right Column - Booking Calendar */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <BookingCalendarContainer listing={listing} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

/* function HostInformation({ host }: { host: Host }) {
  return (
    <div className="flex items-center">
      <Image src={host.avatarUrl} alt="Rounded avatar" height={40} width={40} className="rounded-full" />
      <h3>Hosted by {host.name}</h3>
    </div>
  );
} */

function ListingSubtitle({ listingDetails }: { listingDetails: Listing }) {
  return (
    <div className="space-y-4">
      {/* Property Type and Location */}
      <div className="flex items-center gap-2 text-lg text-myGray">
        <IoLocation className="w-5 h-5" />
        <h2 className="font-medium">
          {listingDetails.propertyType} in {listingDetails.location.city}
        </h2>
      </div>

      {/* Structure Badges */}
      <div>
        <ListBadges badges={listingDetails.structure} className="text-base" />
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-myGreenExtraLight px-3 py-1.5 rounded-full">
          <IoStar className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold text-myGrayDark">{listingDetails.score.value.toFixed(1)}</span>
        </div>
        <span className="text-myGray font-medium underline cursor-pointer hover:text-myGrayDark transition-colors">
          {listingDetails.score.reviews.length} reviews
        </span>
      </div>
    </div>
  );
}
