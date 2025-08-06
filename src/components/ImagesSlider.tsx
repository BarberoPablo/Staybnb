"use client";

import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RoundButton } from "./Button/RoundButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function ImagesSlider({
  images,
  containerClassName,
  href,
  hoverEffect,
}: {
  images: string[];
  containerClassName?: string;
  href?: string;
  hoverEffect?: boolean;
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const hoverAnimation = !isMobile && hoverEffect && isHovering ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none";

  useEffect(() => {
    setTimeout(() => {
      if (instanceRef.current) {
        instanceRef.current.update();
        instanceRef.current.moveToIdx(0);
      }
    }, 50);
  }, [images.length, instanceRef]);

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
                <Image src={image} alt={`listing secondary image`} priority fill className="object-cover" sizes="100%" />
              </div>
            ))}

            <div className="absolute bottom-2 right-2 px-3 text-white text-sm rounded-sm bg-myGrayDark">
              {currentSlide + 1}/{images.length}
            </div>

            {loaded && instanceRef.current && (
              <div className={`dots w-full absolute bottom-4 flex justify-center transition-opacity duration-300 ${hoverAnimation}`}>
                {[...Array(images.length).keys()].map((idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        instanceRef.current?.moveToIdx(idx);
                      }}
                      className={`w-2 h-2 rounded-full mx-1 transition-colors duration-300 ${currentSlide === idx ? "bg-black" : "bg-gray-400"}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </ConditionalLink>
        {loaded && instanceRef.current && (
          <>
            <RoundButton
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl transition-opacity duration-300 ${hoverAnimation}`}
              onClick={handlePrev}
            >
              <MdKeyboardArrowLeft />
            </RoundButton>

            <RoundButton
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl transition-opacity duration-300 ${hoverAnimation}`}
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
