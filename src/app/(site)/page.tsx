import { getPopularDestinations } from "@/lib/api/server/endpoints/cities";
import { getFeaturedListings, getPopularListings } from "@/lib/api/server/endpoints/listings";
import { generateOrganizationStructuredData, generateSEOMetadata, generateWebsiteStructuredData } from "@/lib/seo";
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

      <div className="px-12 py-10 w-full space-y-4">
        <section className="relative text-center py-32 md:py-40 -mx-12 -mt-10 mb-4 overflow-hidden">
          <div
            className="absolute inset-0 z-0 hero-bg-animate"
            style={{
              backgroundImage:
                'url("https://deborainteriors.com/wp-content/uploads/2024/05/right-Living-Room-with-Large-Windows-and-Mid-Century-Modern-Furniture-by-Debora.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-10" />

          {/* Content */}
          <div className="relative z-20 px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl hero-title-animate">Find your next stay</h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg max-w-2xl mx-auto hero-subtitle-animate">
              Discover amazing places to stay around the world
            </p>
          </div>
        </section>

        <FeaturedListings listings={featuredListings} />

        <PopularDestinations destinations={popularDestinations} />

        <PopularListings listings={popularListings} />
      </div>
    </>
  );
}
