'use client'

import { IndexLayout } from '@/components/Layout/Index'
import { use, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Minus, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

const productData = {
  id: 1,
  name: 'Premium T-Shirt',
  description:
    'High-quality t-shirt with soft fabric, comfortable to wear, suitable for all occasions',
  image: '/placeholder.svg',
  variants: [
    { size: 'S', price: 590 },
    { size: 'M', price: 590 },
    { size: 'L', price: 650 },
    { size: 'XL', price: 650 },
    { size: 'XXL', price: 720 },
  ],
}

interface FormData {
  size: string
  quantity: number
}

const ProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params)
  const [selectedPrice, setSelectedPrice] = useState(
    productData.variants[0].price,
  )

  const { register, watch, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      size: productData.variants[0].size,
      quantity: 1,
    },
  })

  const watchedSize = watch('size')
  const watchedQuantity = watch('quantity')

  React.useEffect(() => {
    const selectedVariant = productData.variants.find(
      (v) => v.size === watchedSize,
    )
    if (selectedVariant) {
      setSelectedPrice(selectedVariant.price)
    }
  }, [watchedSize])

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
    console.log('Total price:', selectedPrice * data.quantity)
    toast.success(
      `Item added to cart!\nSize: ${data.size}\nQuantity: ${data.quantity}\nTotal Price: $${(selectedPrice * data.quantity).toLocaleString()}`,
    )
  }

  return (
    <IndexLayout>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
          <div className='aspect-square'>
            <img
              src={productData.image}
              alt={productData.name}
              className='h-full w-full rounded-xl object-cover'
            />
          </div>

          <div className='h-fit rounded-xl bg-gradient-to-r from-[#f9e6b3] to-[#f3d27a]'>
            <div className='flex flex-col gap-2.5 p-5'>
              <div className='text-[#4a2c00]'>
                <h1 className='mb-2 text-3xl font-bold'>{productData.name}</h1>
                <p className='text-lg'>{productData.description}</p>
              </div>

              <div className='flex items-center gap-2 text-red-800'>
                <span className='text-3xl font-bold'>
                  ${selectedPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <Card>
              <CardContent className='p-5'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div>
                    <label className='mb-3 block text-sm font-medium text-gray-700'>
                      Select Size
                    </label>
                    <div className='grid grid-cols-5 gap-2'>
                      {productData.variants.map((variant) => (
                        <label
                          key={variant.size}
                          className={`relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-all ${
                            watchedSize === variant.size
                              ? 'border-primary bg-primary/10 text-primary font-medium'
                              : 'border-gray-300 hover:border-gray-400'
                          } `}
                        >
                          <input
                            type='radio'
                            value={variant.size}
                            {...register('size')}
                            className='sr-only'
                          />
                          <span className='text-sm'>{variant.size}</span>
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
                        onClick={() => {
                          if (watchedQuantity > 1) {
                            setValue('quantity', watchedQuantity - 1)
                          }
                        }}
                        disabled={watchedQuantity <= 1}
                      >
                        <Minus />
                      </Button>

                      <input
                        type='number'
                        min='1'
                        max='99'
                        {...register('quantity', { min: 1, max: 99 })}
                        className='w-16 rounded-md border border-gray-300 py-1 text-center'
                      />

                      <Button
                        type='button'
                        variant='outline'
                        className='cursor-pointer'
                        size='sm'
                        onClick={() => {
                          if (watchedQuantity < 99) {
                            setValue('quantity', watchedQuantity + 1)
                          }
                        }}
                        disabled={watchedQuantity >= 99}
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                  </div>

                  <div className='rounded-lg bg-gray-50 p-4'>
                    <div className='flex items-center justify-between pt-2 text-lg font-bold text-gray-900'>
                      <span>Total Price:</span>
                      <span className='text-primary'>
                        ${(selectedPrice * watchedQuantity).toLocaleString()}
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
