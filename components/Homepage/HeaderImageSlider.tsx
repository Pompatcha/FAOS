'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoPlay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HeaderImageSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
    },
    [AutoPlay({ delay: 2500, stopOnInteraction: false })],
  )

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi],
  )

  const onSelect = useCallback(
    (emblaApi: {
      selectedScrollSnap: () => React.SetStateAction<number>
      canScrollPrev: () => unknown
      canScrollNext: () => unknown
    }) => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setPrevBtnDisabled(!emblaApi.canScrollPrev())
      setNextBtnDisabled(!emblaApi.canScrollNext())
    },
    [],
  )

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const slides = [
    {
      image:
        'https://honey.com/images/default/Celebrating-Beekeeping-Around-the-World-Apimondia.jpg',
    },
    {
      image: 'https://i.ibb.co/xqgpNc6q/Screenshot-2568-06-25-at-06-21-30.png',
    },
    {
      image:
        'https://assets.unileversolutions.com/v1/104926993.png?im=Resize,width=1200,height=1200',
    },
    {
      image:
        'https://t4.ftcdn.net/jpg/14/05/14/93/360_F_1405149352_K4qhIYVahGLumUCry09QJaDyquDaXVrh.jpg',
    },
  ]

  return (
    <div className='relative mx-auto w-[80%]'>
      <div className='embla overflow-hidden' ref={emblaRef}>
        <div className='embla__container flex'>
          {slides.map((slide) => (
            <div
              key={slide.image}
              className='embla__slide relative w-full flex-none'
            >
              <img
                src={slide.image}
                className='h-[550px] w-full rounded-lg object-cover'
              />
            </div>
          ))}
        </div>
      </div>

      <button
        className={`absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg transition-all hover:bg-white ${
          prevBtnDisabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-110'
        }`}
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
      >
        <ChevronLeft className='h-5 w-5 cursor-pointer text-gray-700' />
      </button>

      <button
        className={`absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg transition-all hover:bg-white ${
          nextBtnDisabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-110'
        }`}
        onClick={scrollNext}
        disabled={nextBtnDisabled}
      >
        <ChevronRight className='h-5 w-5 cursor-pointer text-gray-700' />
      </button>

      <div className='mt-4 flex justify-center space-x-2'>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              index === selectedIndex
                ? 'scale-125 bg-white'
                : 'cursor-pointer bg-amber-100 hover:bg-white'
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}

export { HeaderImageSlider }
