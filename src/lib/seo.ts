import { Metadata } from "next";

// Base URL for the application
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";

// Default SEO values
export const DEFAULT_TITLE = process.env.NEXT_PUBLIC_SITE_NAME
  ? `${process.env.NEXT_PUBLIC_SITE_NAME} - Find Your Perfect Vacation Rental`
  : "StayBnb - Find Your Perfect Vacation Rental";
export const DEFAULT_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "Discover and book unique accommodations around the world. From cozy apartments to luxury villas, find your perfect stay with StayBnb.";
export const DEFAULT_KEYWORDS = [
  "vacation rentals",
  "short-term rentals",
  "holiday homes",
  "apartments",
  "accommodations",
  "travel",
  "booking",
  "staybnb",
  "airbnb alternative",
  "unique stays",
];

// Site information (configurable via environment variables)
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "StayBnb";
export const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@staybnb";
export const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/staybnb";
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/staybnb";

/**
 * Generate metadata for a page with SEO best practices
 */
export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  path = "",
  images = [],
  noIndex = false,
  type = "website",
  alternateLanguages,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  images?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  alternateLanguages?: Record<string, string>;
}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const url = `${BASE_URL}${path}`;
  const allKeywords = [...DEFAULT_KEYWORDS, ...keywords];
  const pageImages = images.length > 0 ? images : [`${BASE_URL}/og-image.jpg`];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: allKeywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      ...(alternateLanguages && { languages: alternateLanguages }),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type,
      url,
      title: pageTitle,
      description: pageDescription,
      siteName: SITE_NAME,
      images: pageImages.map((image) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: title || DEFAULT_TITLE,
      })),
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: pageImages,
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
  };
}

/**
 * Generate JSON-LD structured data for a listing
 */
export function generateListingStructuredData(listing: {
  id: number;
  title: string;
  description: string;
  nightPrice: number;
  images: string[];
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewCount?: number;
  host?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: listing.title,
    description: listing.description,
    image: listing.images,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city,
      addressCountry: listing.country,
    },
    geo:
      listing.latitude && listing.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: listing.latitude,
            longitude: listing.longitude,
          }
        : undefined,
    priceRange: `$${listing.nightPrice}`,
    aggregateRating:
      listing.rating && listing.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: listing.rating,
            reviewCount: listing.reviewCount,
          }
        : undefined,
    url: `${BASE_URL}/listing/${listing.id}`,
  };
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationStructuredData() {
  const socialLinks = [
    TWITTER_HANDLE !== "@staybnb" ? `https://twitter.com/${TWITTER_HANDLE.replace("@", "")}` : null,
    FACEBOOK_URL !== "https://facebook.com/staybnb" ? FACEBOOK_URL : null,
    INSTAGRAM_URL !== "https://instagram.com/staybnb" ? INSTAGRAM_URL : null,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    ...(socialLinks.length > 0 && { sameAs: socialLinks }),
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}
