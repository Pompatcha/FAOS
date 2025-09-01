'use client'

import AutoPlay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { type EmblaCarouselType } from 'embla-carousel'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

interface SlideData {
  image: string
}

const CAROUSEL_SLIDES: SlideData[] = [
  {
    image:
      'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Celebrating-Beekeeping-Around-the-World-Apimondia.jpg',
  },
  {
    image:
      'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Screenshot-2568-06-25-at-06-21-30.png',
  },
  {
    image:
      'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/104926993.avif',
  },
  {
    image:
      'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/360_F_1405149352_K4qhIYVahGLumUCry09QJaDyquDaXVrh.jpg',
  },
]

const AUTOPLAY_DELAY_MS = 2500

const HeaderImageSlider = () => {
  const [carouselRef, carouselApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
    },
    [AutoPlay({ delay: AUTOPLAY_DELAY_MS, stopOnInteraction: false })],
  )

  const [isPreviousButtonDisabled, setIsPreviousButtonDisabled] = useState(true)
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const scrollToPreviousSlide = useCallback(() => {
    if (carouselApi) carouselApi.scrollPrev()
  }, [carouselApi])

  const scrollToNextSlide = useCallback(() => {
    if (carouselApi) carouselApi.scrollNext()
  }, [carouselApi])

  const scrollToSlideAtIndex = useCallback(
    (slideIndex: number) => {
      if (carouselApi) carouselApi.scrollTo(slideIndex)
    },
    [carouselApi],
  )

  const handleCarouselSelect = useCallback(
    (carouselApiInstance: EmblaCarouselType) => {
      setCurrentSlideIndex(carouselApiInstance.selectedScrollSnap())
      setIsPreviousButtonDisabled(!carouselApiInstance.canScrollPrev())
      setIsNextButtonDisabled(!carouselApiInstance.canScrollNext())
    },
    [],
  )

  useEffect(() => {
    if (!carouselApi) return

    handleCarouselSelect(carouselApi)
    carouselApi.on('reInit', handleCarouselSelect)
    carouselApi.on('select', handleCarouselSelect)
  }, [carouselApi, handleCarouselSelect])

  const getPaginationButtonClassName = (slideIndex: number) => {
    const baseClasses = 'h-3 w-3 rounded-full transition-all'
    const activeClasses = 'scale-125 bg-white'
    const inactiveClasses = 'cursor-pointer bg-amber-100 hover:bg-white'

    return `${baseClasses} ${
      slideIndex === currentSlideIndex ? activeClasses : inactiveClasses
    }`
  }

  const getNavigationButtonClassName = (isDisabled: boolean) => {
    const baseClasses =
      'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg transition-all hover:bg-white'
    const disabledClasses = 'cursor-not-allowed opacity-50'
    const enabledClasses = 'hover:scale-110'

    return `${baseClasses} ${isDisabled ? disabledClasses : enabledClasses}`
  }

  return (
    <div className='relative mx-auto'>
      <div className='embla overflow-hidden' ref={carouselRef}>
        <div className='embla__container flex'>
          {CAROUSEL_SLIDES.map((slideData, slideIndex) => (
            <div
              key={`${slideData.image}-${slideIndex}`}
              className='embla__slide relative w-full flex-none'
            >
              <img
                src={slideData.image}
                alt={`Slide ${slideIndex + 1}`}
                className='h-[550px] w-full rounded-lg object-cover'
              />
            </div>
          ))}
        </div>
      </div>

      <button
        className={`${getNavigationButtonClassName(isPreviousButtonDisabled)} left-4`}
        onClick={scrollToPreviousSlide}
        disabled={isPreviousButtonDisabled}
        aria-label='Previous slide'
      >
        <ChevronLeft className='h-5 w-5 cursor-pointer text-gray-700' />
      </button>

      <button
        className={`${getNavigationButtonClassName(isNextButtonDisabled)} right-4`}
        onClick={scrollToNextSlide}
        disabled={isNextButtonDisabled}
        aria-label='Next slide'
      >
        <ChevronRight className='h-5 w-5 cursor-pointer text-gray-700' />
      </button>

      <div className='mt-4 flex justify-center space-x-2'>
        {CAROUSEL_SLIDES.map((_, slideIndex) => (
          <button
            key={slideIndex}
            className={getPaginationButtonClassName(slideIndex)}
            onClick={() => scrollToSlideAtIndex(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export { HeaderImageSlider }
