"use client";

import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RoundButton } from "./Button/RoundButton";

export default function ImagesSlider({ images, containerClassName }: { images: string[]; containerClassName?: string }) {
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

  return (
    <>
      <div className={`relative overflow-hidden rounded-xl ${containerClassName}`}>
        <div ref={sliderRef} className="keen-slider h-full w-full">
          {images.map((image, index) => (
            <div key={image} className={`keen-slider__slide number-slide${index + 1} relative h-[300px] min-w-full`}>
              <Image src={image} alt={`listing secondary image`} priority fill className="object-cover" sizes="100%" />
            </div>
          ))}
          {loaded && instanceRef.current && (
            <div className="dots w-full absolute bottom-4 flex justify-center">
              {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => {
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
        {loaded && instanceRef.current && (
          <>
            <RoundButton
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl"
              onClick={(event) => {
                event.stopPropagation();
                instanceRef.current?.prev();
              }}
              disabled={currentSlide === 0}
            >
              <MdKeyboardArrowLeft />
            </RoundButton>

            <RoundButton
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl"
              onClick={(event) => {
                event.stopPropagation();
                instanceRef.current?.next();
              }}
              disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
            >
              <MdKeyboardArrowRight />
            </RoundButton>
          </>
        )}
      </div>
    </>
  );
}
