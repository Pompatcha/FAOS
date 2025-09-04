'use client'

import { useRouter } from 'next/navigation'

import type { FC } from 'react'

interface ProductData {
  id: string
  name: string
  imageUrl: string
  imageAlt?: string
  priceRange: {
    min: number
    max: number
  }
  stockQuantity: number
  currency?: string
}

interface ProductCardProps {
  productData?: ProductData
}

const DEFAULT_PRODUCT_DATA: ProductData = {
  id: '098f6bcd4621d373cade4e832627b4f6',
  name: 'ORGANIC THYME HONEY',
  imageUrl: '/placeholder.svg',
  imageAlt: 'Organic Thyme Honey product image',
  priceRange: {
    min: 250,
    max: 500,
  },
  stockQuantity: 50,
  currency: '฿',
}

const ProductCard: FC<ProductCardProps> = ({
  productData = DEFAULT_PRODUCT_DATA,
}) => {
  const router = useRouter()

  const handleProductCardClick = () => {
    router.push(`/product/${productData.id}`)
  }

  const handleKeyboardNavigation = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleProductCardClick()
    }
  }

  const formatPriceRange = (
    priceRange: ProductData['priceRange'],
    currency: string,
  ) => {
    const { min, max } = priceRange
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`
  }

  const getStockDisplayText = (stockQuantity: number) => {
    return `${stockQuantity} stock`
  }

  const getCardClassName = () => {
    return 'flex cursor-pointer flex-col gap-2.5 rounded-xl bg-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02]'
  }

  return (
    <div
      className={getCardClassName()}
      onClick={handleProductCardClick}
      onKeyDown={handleKeyboardNavigation}
      tabIndex={0}
      role='button'
      aria-label={`View product details for ${productData.name}`}
    >
      <img
        className='h-72 w-full rounded-t-xl object-cover'
        src={productData.imageUrl}
        alt={productData.imageAlt || productData.name}
        loading='lazy'
      />

      <div className='flex flex-col gap-2.5 p-2.5'>
        <h3 className='line-clamp-2 font-medium text-gray-900'>
          {productData.name}
        </h3>

        <div className='flex items-end justify-between'>
          <span className='text-2xl font-bold text-red-800'>
            {formatPriceRange(
              productData.priceRange,
              productData.currency || '฿',
            )}
          </span>

          <span className='text-sm text-gray-600'>
            {getStockDisplayText(productData.stockQuantity)}
          </span>
        </div>
      </div>
    </div>
  )
}

export { ProductCard }
export type { ProductData, ProductCardProps }
