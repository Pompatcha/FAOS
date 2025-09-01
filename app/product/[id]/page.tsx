'use client'

import { IndexLayout } from '@/components/Layout/Index'
import { use, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Minus, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ProductVariant {
  size: string
  price: number
}

interface ProductDetails {
  id: string
  name: string
  description: string
  image: string
  imageAlt?: string
  variants: ProductVariant[]
  currency?: string
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

interface ProductFormData {
  selectedSize: string
  selectedQuantity: number
}

const PRODUCT_MOCKUP_DATA: ProductDetails = {
  id: '1',
  name: 'Premium T-Shirt',
  description:
    'High-quality t-shirt with soft fabric, comfortable to wear, suitable for all occasions',
  image: '/placeholder.svg',
  imageAlt: 'Premium T-Shirt product image',
  variants: [
    { size: 'S', price: 590 },
    { size: 'M', price: 590 },
    { size: 'L', price: 650 },
    { size: 'XL', price: 650 },
    { size: 'XXL', price: 720 },
  ],
  currency: '$',
}

const QUANTITY_LIMITS = {
  min: 1,
  max: 99,
} as const

const ProductPage = ({ params }: ProductPageProps) => {
  const { slug: productSlug } = use(params)

  const productDetails = PRODUCT_MOCKUP_DATA
  const defaultVariant = productDetails.variants[0]

  const [currentSelectedPrice, setCurrentSelectedPrice] = useState(
    defaultVariant.price,
  )

  const productForm = useForm<ProductFormData>({
    defaultValues: {
      selectedSize: defaultVariant.size,
      selectedQuantity: QUANTITY_LIMITS.min,
    },
  })

  const { register, watch, handleSubmit, setValue } = productForm

  const currentSelectedSize = watch('selectedSize')
  const currentSelectedQuantity = watch('selectedQuantity')

  React.useEffect(() => {
    const matchingVariant = productDetails.variants.find(
      (variant) => variant.size === currentSelectedSize,
    )
    if (matchingVariant) {
      setCurrentSelectedPrice(matchingVariant.price)
    }
  }, [currentSelectedSize, productDetails.variants])

  const handleProductFormSubmit = (formData: ProductFormData) => {
    const totalPrice = currentSelectedPrice * formData.selectedQuantity

    console.log('Product form submitted:', formData)
    console.log('Total price:', totalPrice)

    toast.success(
      `Item added to cart!\nSize: ${formData.selectedSize}\nQuantity: ${formData.selectedQuantity}\nTotal Price: ${productDetails.currency}${totalPrice.toLocaleString()}`,
    )
  }

  const handleQuantityDecrease = () => {
    if (currentSelectedQuantity > QUANTITY_LIMITS.min) {
      setValue('selectedQuantity', currentSelectedQuantity - 1)
    }
  }

  const handleQuantityIncrease = () => {
    if (currentSelectedQuantity < QUANTITY_LIMITS.max) {
      setValue('selectedQuantity', currentSelectedQuantity + 1)
    }
  }

  const calculateTotalPrice = () => {
    return currentSelectedPrice * currentSelectedQuantity
  }

  const formatPrice = (price: number) => {
    return `${productDetails.currency}${price.toLocaleString()}`
  }

  const getSizeOptionClassName = (variantSize: string) => {
    const baseClasses =
      'relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-all'
    const selectedClasses =
      'border-primary bg-primary/10 text-primary font-medium'
    const unselectedClasses = 'border-gray-300 hover:border-gray-400'

    return `${baseClasses} ${
      currentSelectedSize === variantSize ? selectedClasses : unselectedClasses
    }`
  }

  const isDecreaseButtonDisabled =
    currentSelectedQuantity <= QUANTITY_LIMITS.min
  const isIncreaseButtonDisabled =
    currentSelectedQuantity >= QUANTITY_LIMITS.max

  return (
    <IndexLayout>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
          <div className='aspect-square'>
            <img
              src={productDetails.image}
              alt={productDetails.imageAlt || productDetails.name}
              className='h-full w-full rounded-xl object-cover'
              loading='lazy'
            />
          </div>

          <div className='h-fit rounded-xl bg-gradient-to-r from-[#f9e6b3] to-[#f3d27a]'>
            <div className='flex flex-col gap-2.5 p-5'>
              <div className='text-[#4a2c00]'>
                <h1 className='mb-2 text-3xl font-bold'>
                  {productDetails.name}
                </h1>
                <p className='text-lg'>{productDetails.description}</p>
              </div>

              <div className='flex items-center gap-2 text-red-800'>
                <span className='text-3xl font-bold'>
                  {formatPrice(currentSelectedPrice)}
                </span>
              </div>
            </div>

            <Card>
              <CardContent className='p-5'>
                <form
                  onSubmit={handleSubmit(handleProductFormSubmit)}
                  className='space-y-6'
                >
                  <div>
                    <label className='mb-3 block text-sm font-medium text-gray-700'>
                      Select Size
                    </label>
                    <div className='grid grid-cols-5 gap-2'>
                      {productDetails.variants.map((productVariant) => (
                        <label
                          key={productVariant.size}
                          className={getSizeOptionClassName(
                            productVariant.size,
                          )}
                        >
                          <input
                            type='radio'
                            value={productVariant.size}
                            {...register('selectedSize')}
                            className='sr-only'
                          />
                          <span className='text-sm'>{productVariant.size}</span>
                        </label>
                      ))}
                    </div>
                    <p className='mt-1 text-xs text-gray-500'>
                      Price will change based on selected size
                    </p>
                  </div>

                  <div>
                    <label className='mb-3 block text-sm font-medium text-gray-700'>
                      Quantity
                    </label>
                    <div className='flex items-center gap-3'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='cursor-pointer'
                        onClick={handleQuantityDecrease}
                        disabled={isDecreaseButtonDisabled}
                        aria-label='Decrease quantity'
                      >
                        <Minus />
                      </Button>

                      <input
                        type='number'
                        min={QUANTITY_LIMITS.min}
                        max={QUANTITY_LIMITS.max}
                        {...register('selectedQuantity', {
                          min: QUANTITY_LIMITS.min,
                          max: QUANTITY_LIMITS.max,
                        })}
                        className='w-16 rounded-md border border-gray-300 py-1 text-center'
                        aria-label='Product quantity'
                      />

                      <Button
                        type='button'
                        variant='outline'
                        className='cursor-pointer'
                        size='sm'
                        onClick={handleQuantityIncrease}
                        disabled={isIncreaseButtonDisabled}
                        aria-label='Increase quantity'
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                  </div>

                  <div className='rounded-lg bg-gray-50 p-4'>
                    <div className='flex items-center justify-between pt-2 text-lg font-bold text-gray-900'>
                      <span>Total Price:</span>
                      <span className='text-primary'>
                        {formatPrice(calculateTotalPrice())}
                      </span>
                    </div>
                  </div>

                  <Button
                    type='submit'
                    size='lg'
                    className='w-full py-3 text-lg'
                  >
                    Add to Cart
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </IndexLayout>
  )
}

export default ProductPage
