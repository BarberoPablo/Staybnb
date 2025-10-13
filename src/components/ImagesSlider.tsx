"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useKeenSlider } from "keen-slider/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RoundButton } from "./Button/RoundButton";
import ImageWithFallback, { FallbackIcon } from "./ImageWithFallback";

export default function ImagesSlider({
  images,
  containerClassName,
  href,
  hoverEffect,
  insideMap = false,
}: {
  images: string[];
  containerClassName?: string;
  href?: string;
  hoverEffect?: boolean;
  insideMap?: boolean;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const hoverAnimation = isMobile || (hoverEffect && isHovering) ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none";

  useEffect(() => {
    requestAnimationFrame(() => {
      if (instanceRef.current) {
        instanceRef.current.update();
        instanceRef.current.moveToIdx(0);
      }
    });
  }, [instanceRef]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        instanceRef.current?.update();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [instanceRef]);

  const handlePrev = () => {
    if (instanceRef.current) {
      if (currentSlide === 0) {
        instanceRef.current.moveToIdx(images.length - 1);
      } else {
        instanceRef.current.prev();
      }
    }
  };

  const handleNext = () => {
    if (instanceRef.current) {
      if (currentSlide === images.length - 1) {
        instanceRef.current.moveToIdx(0);
      } else {
        instanceRef.current.next();
      }
    }
  };

  const handleHoverButton = (hovering: boolean) => {
    if (hoverEffect) {
      setIsHovering(hovering);
    }
  };

  const handleDotClick = (index: number) => {
    instanceRef.current?.moveToIdx(index);
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-xl ${containerClassName}`}
        onMouseOver={() => handleHoverButton(true)}
        onMouseOut={() => handleHoverButton(false)}
      >
        <ConditionalLink href={href || ""} condition={!!href}>
          <div ref={sliderRef} className="keen-slider h-full w-full">
            {images.map((image, index) => (
              <div key={image} className={`keen-slider__slide number-slide${index + 1} relative h-[300px] min-w-full`}>
                {image ? (
                  <ImageWithFallback src={image + "&w=480"} alt={`listing secondary image`} priority fill className="object-cover" sizes="100%" />
                ) : (
                  <FallbackIcon />
                )}
              </div>
            ))}

            {/* Image Counter Badge */}
            <div className="absolute bottom-3 right-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-gray-200/50 text-sm rounded-full shadow-lg">
              <span className="font-semibold text-myGrayDark">
                {currentSlide + 1}/{images.length}
              </span>
            </div>

            {/* Navigation Dots */}
            {loaded && instanceRef.current && (
              <Dots totalDots={images.length} currentSlide={currentSlide} onDotClick={handleDotClick} hoverAnimation={hoverAnimation} />
            )}
          </div>
        </ConditionalLink>

        {/* Navigation Arrows */}
        {(!isMobile || insideMap) && loaded && instanceRef.current && (
          <>
            <RoundButton
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-xl transition-all duration-300 text-myGrayDark bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl hover:scale-105 ${hoverAnimation}`}
              onClick={handlePrev}
            >
              <MdKeyboardArrowLeft />
            </RoundButton>

            <RoundButton
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xl transition-all duration-300 text-myGrayDark bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl hover:scale-105 ${hoverAnimation}`}
              onClick={handleNext}
            >
              <MdKeyboardArrowRight />
            </RoundButton>
          </>
        )}
      </div>
    </>
  );
}

function ConditionalLink({ children, condition, href }: { children: React.ReactNode; condition: boolean; href: string }) {
  return condition ? <Link href={href}>{children}</Link> : <>{children}</>;
}

interface DotsProps {
  totalDots: number;
  currentSlide: number;
  onDotClick: (index: number) => void;
  hoverAnimation: string;
}

function Dots({ totalDots, currentSlide, onDotClick, hoverAnimation }: DotsProps) {
  const maxVisibleDots = 3;

  if (totalDots <= maxVisibleDots) {
    // Show all dots if 3 or fewer images
    return (
      <div className={`dots w-full absolute bottom-2 flex justify-center transition-all duration-300 ${hoverAnimation}`}>
        {[...Array(totalDots).keys()].map((idx) => (
          <button
            key={idx}
            onClick={() => onDotClick(idx)}
            className={`w-2.5 h-2.5 rounded-full mx-1 transition-all duration-300 ${
              currentSlide === idx ? "bg-myGreenSemiBold scale-110 shadow-md" : "bg-white/70 hover:bg-white/90 hover:scale-105"
            }`}
          />
        ))}
      </div>
    );
  } else {
    // Show only 3 dots with dynamic positioning
    const startIdx = Math.max(0, Math.min(currentSlide - 1, totalDots - maxVisibleDots));

    return (
      <div className={`dots w-full absolute bottom-2 flex justify-center transition-all duration-300 ${hoverAnimation}`}>
        {[...Array(maxVisibleDots).keys()].map((dotIdx) => {
          const actualIdx = startIdx + dotIdx;
          const isActive = currentSlide === actualIdx;

          return (
            <button
              key={actualIdx}
              onClick={() => onDotClick(actualIdx)}
              className={`w-2.5 h-2.5 rounded-full mx-1 transition-all duration-300 ${
                isActive ? "bg-myGreenSemiBold scale-110 shadow-md" : "bg-white/70 hover:bg-white/90 hover:scale-105"
              }`}
            />
          );
        })}
      </div>
    );
  }
}
