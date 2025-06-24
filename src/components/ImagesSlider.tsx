"use client";

import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";

export default function ImagesSlider({ images }: { images: string[] }) {
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
      <div className="relative overflow-hidden rounded-xl">
        <div ref={sliderRef} className="keen-slider">
          {images.map((image, index) => (
            <div key={image} className={`keen-slider__slide number-slide${index + 1} relative h-[300px]`}>
              <Image src={image} alt={`listing secondary image`} priority fill className="object-cover" sizes="100%" />
            </div>
          ))}
        </div>
        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
              disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
            />
          </>
        )}
      </div>
      {loaded && instanceRef.current && (
        <div className="flex justify-center mt-4">
          <div className="dots">
            {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx);
                  }}
                  className={`w-2 h-2 rounded-full mx-1 transition-colors duration-300 ${currentSlide === idx ? "bg-black" : "bg-gray-400"}`}
                ></button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function Arrow(props: { disabled: boolean; left?: boolean; onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void }) {
  return (
    <svg
      onClick={props.onClick}
      className={`w-8 h-8 sm:w-10 sm:h-10 absolute top-1/2 transform -translate-y-1/2 cursor-pointer fill-white drop-shadow-lg z-10
        ${props.left ? "left-2" : "right-2"}
        ${props.disabled ? "hidden" : ""}
      `}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />}
      {!props.left && <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />}
    </svg>
  );
}
