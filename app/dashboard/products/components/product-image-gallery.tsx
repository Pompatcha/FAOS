'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export function ProductImageGallery({
  images,
  productName,
  isOpen,
  onClose,
  initialIndex = 0,
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-4xl p-0'>
        <div className='relative'>
          <Button
            variant='ghost'
            size='sm'
            className='absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70'
            onClick={onClose}
          >
            <X className='h-4 w-4' />
          </Button>

          <div className='relative'>
            <img
              src={images[currentIndex] || '/placeholder.svg'}
              alt={`${productName} - Image ${currentIndex + 1}`}
              className='h-[60vh] w-full bg-gray-100 object-contain'
            />

            {images.length > 1 && (
              <>
                <Button
                  variant='ghost'
                  size='sm'
                  className='absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70'
                  onClick={prevImage}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70'
                  onClick={nextImage}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </>
            )}

            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white'>
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {images.length > 1 && (
            <div className='bg-gray-50 p-4'>
              <div className='flex justify-center gap-2 overflow-x-auto'>
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                      index === currentIndex
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`${productName} thumbnail ${index + 1}`}
                      className='h-full w-full object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
