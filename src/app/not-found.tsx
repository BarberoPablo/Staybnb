import Link from "next/link";
import { generateSEOMetadata } from "@/lib/seo";

// 404 pages should not be indexed
export const metadata = generateSEOMetadata({
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-myGreenSemiBold">404</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-myGrayDark mb-4">Page Not Found</h2>
          <p className="text-lg text-myGray">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The listing may have been removed or the URL might be incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-myGreenSemiBold text-white rounded-lg hover:bg-myGreen transition-colors font-medium">
            Go Home
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 bg-white text-myGrayDark border-2 border-myGreenSemiBold rounded-lg hover:bg-myGreenExtraLight transition-colors font-medium"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
