'use client'

import { Info, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { FC } from 'react'

import { numberFormatter, priceFormatter } from '@/lib/number'
import { cn } from '@/lib/utils'

import { Alert, AlertDescription } from './ui/alert'

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
        className='text-primary absolute top-2.5 left-2.5 z-20 rounded-full bg-white'
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
          <img className='h-full w-full object-cover' src='/placeholder.svg' />
        )}
      </div>

  )
}

export { ProductCard }
