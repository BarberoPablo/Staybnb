import { getPopularDestinations } from "@/lib/api/server/endpoints/cities";
import { getFeaturedListings, getPopularListings } from "@/lib/api/server/endpoints/listings";
import { generateOrganizationStructuredData, generateSEOMetadata, generateWebsiteStructuredData } from "@/lib/seo";
import FeaturedListings from "./components/FeaturedListings";
import HomeBanner from "./components/HomeBanner";
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

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
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

      <div className="px-12 py-10 w-full space-y-4">
        <HomeBanner />

        <FeaturedListings listings={featuredListings} searchParams={searchParams} />

        <PopularDestinations destinations={popularDestinations} />

        <PopularListings listings={popularListings} searchParams={searchParams} />
      </div>
    </>
  );
}
