import BookingCalendarContainer from "@/components/Booking/BookingCalendarContainer";
import { ImagesLayout } from "@/components/ImagesLayout";
import ImagesSlider from "@/components/ImagesSlider";
import { api } from "@/lib/api/api";
import { notFound } from "next/navigation";
import { Container } from "../../components/Container";
import ListingDetails from "./components/ListingDetails";

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
    <Container noPadding className="flex flex-col mx-auto px-2 sm:px-6 py-8 gap-8">
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
          <ListingDetails listing={listing} />

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
