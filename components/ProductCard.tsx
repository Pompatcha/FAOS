'use client'

import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { FC } from 'react'

import { priceFormatter } from '@/lib/number'
import { cn } from '@/lib/utils'

export interface Product {
  id: number
  category: {
    id: number
    name: string
  }
  images: {
    id?: number
    image_url?: string
  }[]
  name: string
  preorder_day: number
  preorder_enabled: boolean
  min_price: number
  max_price: number
  min_stock: number
  max_stock: number
}

interface ProductCardProps {
  product?: Product
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const router = useRouter()

  const handleProductCardClick = () => {
    router.push(`/product/${product?.id || 0}`)
  }

  const hasImages = product?.images && product.images.length > 0
  const hasMultipleImages = hasImages && product.images.length > 1

  return (
    <div
      className='relative flex cursor-pointer flex-col gap-2.5 rounded-xl bg-white'
      onClick={handleProductCardClick}
    >
      <PlusCircle
        size={35}
        className='text-primary absolute top-2.5 left-2.5 z-20 rounded-full bg-white backdrop-blur-md'
      />

      <div
        className={cn(
          'h-72 w-full overflow-hidden rounded-t-xl',
          hasMultipleImages && 'group',
        )}
      >
        {hasImages ? (
          <div
            className={cn(
              'flex h-full w-full duration-500',
              hasMultipleImages && 'group-hover:-translate-x-[100%]',
            )}
          >
            {product.images.slice(0, 2).map((img, index) => (
              <img
                // eslint-disable-next-line react/no-array-index-key
                key={`${img}-${index}`}
                src={img?.image_url || '/placeholder.svg'}
                alt={`รูปของ ${product?.name} ${index + 1}`}
                className='h-full w-full flex-[0_0_100%] object-cover select-none'
                draggable={false}
                loading='lazy'
              />
            ))}
          </div>
        ) : (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img className='h-full w-full object-cover' src='/placeholder.svg' />
        )}
      </div>
      <div className='flex flex-col gap-2.5 p-2.5'>
        <h3 className='line-clamp-2 text-lg leading-tight font-semibold text-gray-800'>
          {product?.name}
        </h3>

        <div className='flex items-end justify-between'>
          <span className='text-xl font-bold text-red-800'>
            {product?.min_price && product?.max_price
              ? product.min_price === product.max_price
                ? priceFormatter.format(product.min_price)
                : `${priceFormatter.format(
                    product.min_price,
                  )} - ${priceFormatter.format(product.max_price)}  (Depends on size)`
              : 'n/a'}{' '}
          </span>
        </div>
      </div>
    </div>
  )
}

export { ProductCard }
