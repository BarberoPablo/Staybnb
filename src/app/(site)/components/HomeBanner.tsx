"use client";

import ImageWithFallback from "@/components/ImageWithFallback";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function HomeBanner() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Consider "scrolled" if we're more than 100px from the top
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeatured = () => {
    // Scroll to the featured section (next section after banner)
    const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint
    const bannerHeight = isLargeScreen ? 580 : 570;
    window.scrollTo({
      top: bannerHeight,
      behavior: "smooth",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative text-center py-32 md:py-40 -mx-12 -mt-10 mb-4 overflow-hidden">
      {/* Next.js optimized image */}
      <ImageWithFallback
        src="https://i.postimg.cc/W1MhXvG8/banner-image.webp"
        alt="Modern living room interior"
        fill
        priority
        className="object-cover z-0 hero-bg-animate"
        sizes="100vw"
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

      {!isScrolled && (
        <button
          onClick={scrollToFeatured}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/80 hover:text-white transition-all duration-300 animate-bounce cursor-pointer group"
          aria-label="Scroll to featured stays"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Featured Stays</span>
            <FaChevronDown className="w-8 h-8 drop-shadow-lg" />
          </div>
        </button>
      )}

      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          aria-label="Scroll to top"
        >
          <FaChevronUp className="w-6 h-6" />
        </button>
      )}
    </section>
  );
}
