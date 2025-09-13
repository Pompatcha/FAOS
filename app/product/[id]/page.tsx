'use client'

import { Info, Minus, PlusIcon } from 'lucide-react'
import { use, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ImageSlider } from '@/components/ImageSlider'
import { IndexLayout } from '@/components/Layout/Index'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const mockProduct = {
  id: '1',
  name: 'Premium T-Shirt',
  description:
    'High-quality t-shirt with soft fabric, comfortable to wear, suitable for all occasions',
  image: '/placeholder.svg',
  variants: [
    { size: '120 ML', price: 399 },
    { size: '250 ML', price: 590 },
  ],
  currency: '฿',
}

interface ProductFormData {
  selectedSize: string
  selectedQuantity: number
}

const ProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params)
  const [selectedPrice, setSelectedPrice] = useState(
    mockProduct.variants[0].price,
  )

  const { register, watch, handleSubmit, setValue } = useForm<ProductFormData>({
    defaultValues: {
      selectedSize: mockProduct.variants[0].size,
      selectedQuantity: 1,
    },
  })

  const selectedSize = watch('selectedSize')
  const selectedQuantity = watch('selectedQuantity')

  useEffect(() => {
    const variant = mockProduct.variants.find((v) => v.size === selectedSize)
    if (variant) {
      setSelectedPrice(variant.price)
    }
  }, [selectedSize])

  const onSubmit = (data: ProductFormData) => {
    const totalPrice = selectedPrice * data.selectedQuantity

    toast.success(
      `Item added to cart!\nSize: ${data.selectedSize}\nQuantity: ${data.selectedQuantity}\nTotal Price: ${mockProduct.currency}${totalPrice.toLocaleString()}`,
    )
  }

  const decreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setValue('selectedQuantity', selectedQuantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (selectedQuantity < 99) {
      setValue('selectedQuantity', selectedQuantity + 1)
    }
  }

  const totalPrice = selectedPrice * selectedQuantity
  const formatPrice = (price: number) =>
    `${mockProduct.currency}${price.toLocaleString()}`

  return (
    <IndexLayout>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
          <div className='aspect-square'>
            <ImageSlider
              images={[
                'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Celebrating-Beekeeping-Around-the-World-Apimondia.jpg',
                'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Screenshot-2568-06-25-at-06-21-30.png',
                'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/104926993.avif',
                'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/360_F_1405149352_K4qhIYVahGLumUCry09QJaDyquDaXVrh.jpg',
              ]}
            />
          </div>

          <div className='h-fit rounded-xl border-4 border-[#f3d27a] bg-gradient-to-r from-[#f9e6b3] to-[#f3d27a]'>
            <div className='flex flex-col gap-2.5 p-5'>
              <div className='text-[#4a2c00]'>
                <h1 className='mb-2 text-3xl font-bold'>{mockProduct.name}</h1>
                <p className='text-lg'>{mockProduct.description}</p>
              </div>

              <div className='flex items-center gap-2 text-red-800'>
                <span className='text-3xl font-bold'>
                  {formatPrice(selectedPrice)}
                </span>
              </div>
            </div>

            <Alert variant='destructive'>
              <Info />
              <AlertDescription>
                Pre-Order Item - Ships 30 days
              </AlertDescription>
              <AlertDescription>
                This item is available for pre-order. Your order will be
                processed and shipped once the product becomes available.
              </AlertDescription>
            </Alert>

            <Card className='shadow-2xl'>
              <CardContent className='p-5'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div>
                    <label className='mb-3 block text-sm font-medium text-gray-700'>
                      Select Size
                    </label>
                    <div className='grid grid-cols-5 gap-2'>
                      {mockProduct.variants.map((variant) => (
                        <label
                          key={variant.size}
                          className={`relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-all ${
                            selectedSize === variant.size
                              ? 'border-primary bg-primary/10 text-primary font-medium'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type='radio'
                            value={variant.size}
                            {...register('selectedSize')}
                            className='sr-only'
                          />
                          <span className='text-sm'>{variant.size}</span>
                        </label>
                      ))}
                    </div>
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
                        onClick={decreaseQuantity}
                        disabled={selectedQuantity <= 1}
                        aria-label='Decrease quantity'
                      >
                        <Minus />
                      </Button>

                      <input
                        type='number'
                        min={1}
                        max={99}
                        {...register('selectedQuantity', { min: 1, max: 99 })}
                        className='w-16 rounded-md border border-gray-300 py-1 text-center [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100'
                        aria-label='Product quantity'
                      />

                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={increaseQuantity}
                        disabled={selectedQuantity >= 99}
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
                        {formatPrice(totalPrice)}
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
