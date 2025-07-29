"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeaderImageSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(
    (emblaApi: {
      selectedScrollSnap: () => React.SetStateAction<number>;
      canScrollPrev: () => unknown;
      canScrollNext: () => unknown;
    }) => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const slides = [
    {
      id: 1,
      image:
        "https://honey.com/images/default/Celebrating-Beekeeping-Around-the-World-Apimondia.jpg",
      title: "Beautiful Landscape 1",
      description: "Amazing mountain view with sunset",
    },
    {
      id: 2,
      image: "https://i.ibb.co/xqgpNc6q/Screenshot-2568-06-25-at-06-21-30.png",
      title: "Ocean Paradise",
      description: "Crystal clear blue water and white sand",
    },
    {
      id: 3,
      image:
        "https://assets.unileversolutions.com/v1/104926993.png?im=Resize,width=1200,height=1200",
      title: "City Lights",
      description: "Modern cityscape at night",
    },
    {
      id: 4,
      image:
        "https://t4.ftcdn.net/jpg/14/05/14/93/360_F_1405149352_K4qhIYVahGLumUCry09QJaDyquDaXVrh.jpg",
      title: "Forest Path",
      description: "Peaceful walk through the woods",
    },
  ];

  return (
    <div className="relative mx-auto">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="embla__slide flex-none w-full relative"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-[550px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white text-xl font-bold mb-2">
                  {slide.title}
                </h3>
                <p className="text-white/90 text-sm">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all ${
          prevBtnDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
        }`}
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      <button
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all ${
          nextBtnDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
        }`}
        onClick={scrollNext}
        disabled={nextBtnDisabled}
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-white scale-125"
                : "bg-amber-100 hover:bg-white cursor-pointer"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export { HeaderImageSlider };
