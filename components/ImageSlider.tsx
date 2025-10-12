'use client'

import { type EmblaCarouselType } from 'embla-carousel'
import AutoPlay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { FC } from 'react'

interface ImageSliderProps {
  images: string[]
}

const ImageSlider: FC<ImageSliderProps> = ({ images = [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [AutoPlay({ delay: 2500, stopOnInteraction: false })],
  )

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()
  const scrollTo = (index: number) => emblaApi?.scrollTo(index)

  const updateButtons = (api: EmblaCarouselType) => {
    setCurrentIndex(api.selectedScrollSnap())
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }

  useEffect(() => {
    if (!emblaApi) return

    updateButtons(emblaApi)
    emblaApi.on('reInit', updateButtons)
    emblaApi.on('select', updateButtons)
  }, [emblaApi])

  return (
    <div className='relative w-full'>
      <div className='embla overflow-hidden' ref={emblaRef}>
        <div className='embla__container flex'>
          {Array.isArray(images) &&
            !!images &&
            images?.map((image, index) => (
              <div
                key={`slide-${index}`}
                className='embla__slide relative w-full flex-none'
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className='h-[450px] w-full rounded-lg object-cover'
                />
              </div>
            ))}
        </div>
      </div>

      <button
        className={`absolute top-1/2 left-4 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-lg transition-all hover:bg-white ${
          !canScrollPrev ? 'cursor-not-allowed opacity-50' : 'hover:scale-110'
        }`}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label='Previous slide'
      >
        <ChevronLeft className='h-5 w-5 text-gray-700' />
      </button>

      <button
        className={`absolute top-1/2 right-4 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-lg transition-all hover:bg-white ${
          !canScrollNext ? 'cursor-not-allowed opacity-50' : 'hover:scale-110'
        }`}
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label='Next slide'
      >
        <ChevronRight className='h-5 w-5 text-gray-700' />
      </button>

      <div className='mt-4 flex justify-center space-x-2'>
        {images?.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentIndex
                ? 'scale-125 bg-white'
                : 'cursor-pointer bg-amber-100 hover:bg-white'
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
export { ImageSlider }
