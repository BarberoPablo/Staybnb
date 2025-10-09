import { getPopularDestinations } from "@/lib/api/server/endpoints/cities";
import { getFeaturedListings, getPopularListings } from "@/lib/api/server/endpoints/listings";
import BecomeHostBanner from "./components/BecomeHostBanner";
import { Container } from "./components/Container";
import FeaturedListings from "./components/FeaturedListings";
import PopularDestinations from "./components/PopularDestinations";
import PopularListings from "./components/PopularListings";

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
