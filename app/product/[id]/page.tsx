'use client'

import { SetStateAction, useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { Header } from '@/components/Layout/Header'
import { Menu } from '@/components/Layout/Menu'
import { Banner } from '@/components/Homepage/Banner'
import { Footer } from '@/components/Layout/Footer'
import { formatPrice } from '@/lib/currency'
import { getProduct } from '@/actions/products'
import { Product } from '@/types/product'
import { useQuery } from '@tanstack/react-query'
import { useAddToCart } from '@/hooks/use-carts'
import { use } from 'react'
import { Loading } from '@/components/Layout/Loading'

interface ProductImageSliderProps {
  images: { image_url: string; alt_text?: string }[]
  productName: string
}

interface ProductDetailProps {
  product: Product
}

const ProductImageSlider = ({
  images,
  productName,
}: ProductImageSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [thumbsRef] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi],
  )

  const onSelect = useCallback(
    (emblaApi: { selectedScrollSnap: () => SetStateAction<number> }) => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    },
    [],
  )

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (!images || images.length === 0) {
    return (
      <img
        className='h-96 w-full rounded-2xl object-cover'
        src='/placeholder.svg'
      />
    )
  }

  return (
    <div className='w-full'>
      <div className='relative mb-4'>
        <div className='overflow-hidden rounded-lg' ref={emblaRef}>
          <div className='flex'>
            {images.map((image, index: number) => (
              <div key={index} className='w-full flex-none'>
                <Image
                  src={image.image_url}
                  alt={image.alt_text || `${productName} - ภาพที่ ${index + 1}`}
                  className='h-96 w-full object-cover'
                  width={400}
                  height={384}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              className='absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:scale-110 hover:bg-white'
              onClick={scrollPrev}
            >
              <ChevronLeft className='h-5 w-5 text-gray-700' />
            </button>

            <button
              className='absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:scale-110 hover:bg-white'
              onClick={scrollNext}
            >
              <ChevronRight className='h-5 w-5 text-gray-700' />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className='overflow-hidden' ref={thumbsRef}>
          <div className='flex gap-2'>
            {images.map((image, index: number) => (
              <button
                key={index}
                className={`h-20 w-20 flex-none overflow-hidden rounded-lg border-2 transition-all ${
                  index === selectedIndex
                    ? 'scale-105 border-amber-500'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
                onClick={() => scrollTo(index)}
              >
                <Image
                  src={image.image_url}
                  alt={
                    image.alt_text || `${productName} - ภาพย่อที่ ${index + 1}`
                  }
                  className='h-full w-full object-cover'
                  width={80}
                  height={80}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1)
  const addToCartMutation = useAddToCart()

  const handleAddToCart = async () => {
    try {
      await addToCartMutation.mutateAsync({
        product_id: product.id,
        quantity: quantity,
      })

      setQuantity(1)
    } catch (error) {}
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const isOutOfStock = product.stock === 0 || product.status === 'out_of_stock'
  const isInactive = product.status === 'inactive'
  const isAvailable = product.status === 'active' && product.stock > 0

  return (
    <div className='flex flex-col gap-5'>
      <h1 className='text-2xl font-bold text-[#8a6a1b]'>{product.name}</h1>

      <div className='flex items-center gap-3'>
        <span className='text-2xl font-bold text-[#dda700]'>
          {formatPrice(product.price)}
        </span>
        {isOutOfStock && (
          <span className='rounded-full bg-red-100 px-2 py-1 text-sm text-red-700'>
            Out of Stock
          </span>
        )}
        {isInactive && (
          <span className='rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700'>
            Inactive
          </span>
        )}
      </div>

      {product.description && (
        <p className='leading-relaxed text-gray-600'>{product.description}</p>
      )}

      <div className='flex items-center gap-2 text-sm text-gray-600'>
        <span
          className={`font-medium ${
            product.stock <= 10 ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {product.stock} units available
        </span>
      </div>

      {isAvailable && (
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className='flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Minus className='size-4' />
            </button>
            <span className='min-w-[2rem] text-center font-medium'>
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
              className='flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Plus className='size-4' />
            </button>
          </div>
        </div>
      )}

      <div className='flex gap-3'>
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable || addToCartMutation.isPending}
          className='flex-1 cursor-pointer rounded-lg bg-[#dda700] px-4 py-2 font-medium text-white transition-colors hover:bg-[#cc9600] disabled:cursor-not-allowed disabled:opacity-50'
        >
          {addToCartMutation.isPending
            ? 'Adding...'
            : isOutOfStock
              ? 'Out of Stock'
              : isInactive
                ? 'Unavailable'
                : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      return await getProduct(id)
    },
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className='flex min-h-full flex-col items-center'>
        <Header />
        <Menu />
        <div className='w-full bg-[#fff9df] p-5'>
          <Banner />
          <div className='flex h-96 items-center justify-center'>
            <div className='text-center'>
              <div className='mb-4 text-6xl text-gray-400'>😕</div>
              <h2 className='mb-2 text-2xl font-bold text-gray-700'>
                Product Not Found
              </h2>
              <p className='text-gray-600'>
                The product you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className='flex min-h-screen flex-col items-center'>
        <Header />
        <Menu />
        <div className='w-full bg-[#fff9df] p-5'>
          <Banner />
          <div className='flex h-96 items-center justify-center'>
            <div className='text-center'>
              <div className='mb-4 text-6xl text-gray-400'>📦</div>
              <h2 className='mb-2 text-2xl font-bold text-gray-700'>
                No Product Data
              </h2>
              <p className='text-gray-600'>
                Unable to load product information.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Header />
      <Menu />

      <div className='w-full bg-[#fff9df] p-5'>
        <Banner />

        <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <ProductImageSlider
            images={product.images || []}
            productName={product.name}
          />

          <div>
            <ProductDetail product={product} />
          </div>
        </div>

        <Footer className='mt-5 text-black' />
      </div>
    </div>
  )
}
