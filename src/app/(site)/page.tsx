import { getPopularDestinations } from "@/lib/api/server/endpoints/cities";
import { getFeaturedListings, getPopularListings } from "@/lib/api/server/endpoints/listings";
import { generateOrganizationStructuredData, generateSEOMetadata, generateWebsiteStructuredData } from "@/lib/seo";
import BecomeHostBanner from "./components/BecomeHostBanner";
import { Container } from "./components/Container";
import FeaturedListings from "./components/FeaturedListings";
import PopularDestinations from "./components/PopularDestinations";
import PopularListings from "./components/PopularListings";

// Revalidate this page every 5 minutes (300 seconds)
// This enables Incremental Static Regeneration (ISR) for optimal performance
export const revalidate = 300;

export const metadata = generateSEOMetadata({
  title: "Find Your Perfect Vacation Rental",
  description:
    "Discover and book unique accommodations around the world. From cozy apartments to luxury villas, browse featured properties, popular destinations, and find your perfect vacation rental.",
  keywords: ["featured properties", "popular destinations", "luxury villas", "cozy apartments", "worldwide accommodations", "best vacation rentals"],
  path: "/",
});

export default async function Home() {
  const [featuredListings, popularListings, popularDestinations] = await Promise.all([
    getFeaturedListings(12),
    getPopularListings(12),
    getPopularDestinations(6),
  ]);

  // Generate structured data for SEO
  const websiteStructuredData = generateWebsiteStructuredData();
  const organizationStructuredData = generateOrganizationStructuredData();

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }} />

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
    </>
  );
}
