'use client'

import { useAddToCart } from '@/hooks/use-carts'
import { Product } from '@/types/product'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const addToCartMutation = useAddToCart()

  const sortedImages =
    product.images?.sort((a, b) => a.sort_order - b.sort_order) || []

  const hasImages = sortedImages.length > 0
  const displayImage = hasImages ? sortedImages[currentImageIndex] : null

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) =>
        prev === sortedImages.length - 1 ? 0 : prev + 1,
      )
    }
  }

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? sortedImages.length - 1 : prev - 1,
      )
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price)
  }

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

  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl'>
      <div className='relative aspect-square h-[250px] w-full overflow-hidden'>
        <Image
          src={displayImage?.image_url || '/placeholder.svg'}
          alt={displayImage?.alt_text || `${product.name} placeholder`}
          fill
          className='object-cover transition-transform duration-300 hover:scale-105'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />

        {hasImages && sortedImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className='bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 left-2 -translate-y-1/2 transform cursor-pointer rounded-full bg-white/50 p-2 text-white transition-opacity hover:scale-105'
              aria-label='Previous image'
            >
              <ChevronLeft className='size-5 text-gray-500' />
            </button>
            <button
              onClick={nextImage}
              className='bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 right-2 -translate-y-1/2 transform cursor-pointer rounded-full bg-white/50 p-2 text-white transition-opacity hover:scale-105'
              aria-label='Next image'
            >
              <ChevronRight className='size-5 text-gray-500' />
            </button>
          </>
        )}

        {hasImages && sortedImages.length > 1 && (
          <div className='absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-1'>
            {sortedImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? 'bg-white'
                    : 'bg-opacity-50 bg-white'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className='absolute top-2 right-2'>
          {product.stock > 0 ? (
            <span className='rounded-full bg-green-500 px-2 py-1 text-xs text-white'>
              In Stock
            </span>
          ) : (
            <span className='rounded-full bg-red-500 px-2 py-1 text-xs text-white'>
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className='p-4'>
        <h3 className='mb-2 line-clamp-2 text-lg font-semibold text-gray-900'>
          {product.name}
        </h3>

        {product.description && (
          <p className='mb-3 line-clamp-2 text-sm text-gray-600'>
            {product.description}
          </p>
        )}

        <div className='mb-3 flex items-center justify-between'>
          <span className='text-2xl font-bold text-[#dda700]'>
            {formatPrice(product.price)}
          </span>
          <span className='text-sm text-gray-500'>{product.stock} left</span>
        </div>

        {product.stock > 0 && (
          <div className='mb-3 flex items-center justify-center space-x-3'>
            <div
              onClick={() => handleQuantityChange(quantity - 1)}
              className='flex-center flex size-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Minus className='size-4' />
            </div>
            <span className='min-w-[2rem] text-center font-medium'>
              {quantity}
            </span>
            <div
              onClick={() => handleQuantityChange(quantity + 1)}
              className='flex-center flex size-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Plus className='size-4' />
            </div>
          </div>
        )}

        <div className='flex space-x-2'>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addToCartMutation.isPending}
            className='flex-1 rounded-lg bg-[#dda700] px-4 py-2 font-medium text-white transition-colors hover:bg-[#cc9600] disabled:cursor-not-allowed disabled:opacity-50'
          >
            {addToCartMutation.isPending
              ? 'Adding...'
              : product.stock > 0
                ? 'Add to Cart'
                : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}

export { ProductCard }
