import BookingCalendarContainer from "@/components/Booking/BookingCalendarContainer";
import { ImagesLayout } from "@/components/ImagesLayout";
import ImagesSlider from "@/components/ImagesSlider";
import { getListingWithReservations } from "@/lib/api/server/endpoints/listings";
import { AuthError, NotFoundError } from "@/lib/api/server/errors";
import { AMENITIES } from "@/lib/constants/amenities";
import { generateBreadcrumbStructuredData, generateListingStructuredData, generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "../../components/Container";
import ListingDetails from "./components/ListingDetails";

type ListingDetailsProps = {
  params: Promise<{ id: string }>;
};

// Generate dynamic metadata for each listing page
export async function generateMetadata({ params }: ListingDetailsProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const listing = await getListingWithReservations(Number(id));

    const description = listing.description
      ? `${listing.description.substring(0, 155)}...`
      : `Book ${listing.title} in ${listing.location.city}, ${listing.location.country}. ${listing.propertyType} with ${listing.structure.guests} guests capacity. Starting at $${listing.nightPrice} per night.`;

    return generateSEOMetadata({
      title: `${listing.title} in ${listing.location.city}, ${listing.location.country}`,
      description,
      keywords: [
        listing.location.city,
        listing.location.country,
        listing.propertyType,
        `${listing.structure.guests} guests`,
        listing.privacyType,
        "book now",
        ...listing.amenities.map((a) => AMENITIES[a].name),
      ],
      path: `/listing/${id}`,
      images: listing.images.slice(0, 4),
      type: "article",
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return generateSEOMetadata({
        title: "Listing Not Found",
        description: "The listing you're looking for doesn't exist or has been removed.",
        noIndex: true,
      });
    }
    throw error;
  }
}

export default async function ListingDetailsPage({ params }: ListingDetailsProps) {
  const { id } = await params;

  let listing;
  try {
    listing = await getListingWithReservations(Number(id));
  } catch (error) {
    if (error instanceof AuthError) {
      console.error(error.message);
      redirect("/auth?redirect=/listing/" + id);
    }
    if (error instanceof NotFoundError) {
      console.error(error.message);
      notFound();
    }
    throw error;
  }

  // Generate structured data for SEO
  const listingStructuredData = generateListingStructuredData({
    id: listing.id,
    title: listing.title,
    description: listing.description || "",
    nightPrice: listing.nightPrice,
    images: listing.images,
    city: listing.location.city,
    country: listing.location.country,
    latitude: listing.location.lat,
    longitude: listing.location.lng,
  });

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Search", url: `/search?city=${listing.location.city}` },
    { name: listing.title, url: `/listing/${id}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />

      <Container noPadding className="flex flex-col mx-auto px-2 sm:px-6 py-8 gap-8">
        <div className="relative">
          <div className="hidden lg:block">
            <ImagesLayout images={listing.images} />
          </div>
          <div className="grid relative lg:hidden">
            <ImagesSlider images={listing.images} hoverEffect={true} containerClassName="rounded-t-xl" />
          </div>
        </div>

        <div className="max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <ListingDetails listing={listing} />

            <div className="lg:col-span-5">
              <div className="sticky top-8">
                <BookingCalendarContainer listing={listing} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
