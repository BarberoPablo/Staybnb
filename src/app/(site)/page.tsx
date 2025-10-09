import { getPopularDestinations } from "@/lib/api/server/endpoints/cities";
import { getFeaturedListings, getPopularListings } from "@/lib/api/server/endpoints/listings";
import { logoUrl } from "@/lib/utils";
import { Metadata } from "next";
import BecomeHostBanner from "./components/BecomeHostBanner";
import { Container } from "./components/Container";
import FeaturedListings from "./components/FeaturedListings";
import PopularDestinations from "./components/PopularDestinations";
import PopularListings from "./components/PopularListings";

// Revalidate this page every 5 minutes (300 seconds)
// This enables Incremental Static Regeneration (ISR) for optimal performance
export const revalidate = 300;

// SEO metadata for the home page
export const metadata: Metadata = {
  title: "Find your next stay | Airbnb Clone",
  description:
    "Discover amazing places to stay around the world. Browse featured properties, popular destinations, and book your perfect vacation rental.",
  keywords: ["vacation rentals", "hotels", "apartments", "accommodations", "travel", "booking", "staybnb", "airbnb"],
  openGraph: {
    title: "Find your next stay | Airbnb Clone",
    description: "Discover amazing places to stay around the world",
    images: [logoUrl],
    type: "website",
  },
};

export default async function Home() {
  const [featuredListings, popularListings, popularDestinations] = await Promise.all([
    getFeaturedListings(12),
    getPopularListings(12),
    getPopularDestinations(6),
  ]);

  return (
    <Container>
      <div className="space-y-4">
        <section className="text-center py-12">
          <h1 className="text-5xl md:text-6xl font-bold text-myGrayDark mb-4">Find your next stay</h1>
          <p className="text-xl text-myGray">Discover amazing places to stay around the world</p>
        </section>

        <FeaturedListings listings={featuredListings} />

        <PopularDestinations destinations={popularDestinations} />

        <PopularListings listings={popularListings} />

        <BecomeHostBanner />
      </div>
    </Container>
  );
}
