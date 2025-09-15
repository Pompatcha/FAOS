'use client'
import { useQuery } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { use, useState } from 'react'

import type { ProductOptionInput } from '@/actions/product'

import { getProduct } from '@/actions/product'
import { ImageSlider } from '@/components/ImageSlider'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { priceFormatter } from '@/lib/number'

interface ProductOptionWithId extends ProductOptionInput {
  id: number
}

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number
  }>({})
  const [quantity, setQuantity] = useState<number>(1)

  const getMaxStock = () => {
    if (!product?.options || product.options.length === 0) {
      return product?.max_stock || 0
    }

    const selectedOptionIds = Object.values(selectedOptions)
    if (selectedOptionIds.length === 0) {
      return product?.min_stock || 0
    }

    const selectedOption = product.options.find((option: { id: number }) =>
      selectedOptionIds.includes(option.id),
    )

    return selectedOption?.option_stock || 0
  }

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product/detail', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  })

  const images =
    Array.isArray(product?.images) && product?.images.length > 0
      ? product?.images?.flatMap(
          (image: { image_url: string }) => image?.image_url,
        )
      : ['/placeholder.svg']

  return (
    <IndexLayout>
      <Loading isLoading={productLoading} />

      <div className='container mx-auto'>
        <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
          <div className='aspect-square'>
            <ImageSlider images={images} />
          </div>

          <div className='h-fit rounded-xl border-4 border-[#f3d27a] bg-gradient-to-r from-[#f9e6b3] to-[#f3d27a]'>
            <div className='flex flex-col gap-2.5 p-5'>
              <div className='text-[#4a2c00]'>
                <h1 className='mb-2 text-3xl font-bold'>{product?.name}</h1>
                <p className='text-lg'>{product?.short_description}</p>
              </div>

              <div className='flex items-center gap-2 text-red-800'>
                <span className='text-3xl font-bold'>
                  {product?.min_price && product?.max_price
                    ? product.min_price === product.max_price
                      ? priceFormatter.format(product.min_price)
                      : `${priceFormatter.format(product.min_price)} - ${priceFormatter.format(product.max_price)}`
                    : 'n/a'}
                </span>
              </div>
            </div>

            {product?.preorder_enabled && (
              <Alert variant='destructive'>
                <Info />
                <AlertDescription>
                  Pre-Order Item - Ships {product?.preorder_day} days
                </AlertDescription>
                <AlertDescription>
                  This item is available for pre-order. Your order will be
                  processed and shipped once the product becomes available.
                </AlertDescription>
              </Alert>
            )}

            <Card className='shadow-2xl'>
              <CardContent className='p-5'>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                  }}
                  className='space-y-6'
                >
                  {product?.options && product.options.length > 0 && (
                    <div className='space-y-4'>
                      {Object.entries(
                        (product.options as ProductOptionWithId[]).reduce(
                          (
                            acc: { [key: string]: ProductOptionWithId[] },
                            option: ProductOptionWithId,
                          ) => {
                            if (!acc[option.option_name]) {
                              acc[option.option_name] = []
                            }
                            acc[option.option_name].push(option)
                            return acc
                          },
                          {},
                        ),
                      ).map(([optionName, options]) => (
                        <div key={optionName} className='space-y-2'>
                          <label className='block text-sm font-medium text-gray-700'>
                            {optionName}
                          </label>
                          <div className='grid gap-2 sm:grid-cols-2'>
                            {options.map((option: ProductOptionWithId) => (
                              <button
                                key={option.id}
                                type='button'
                                onClick={() => {
                                  setSelectedOptions((prev) => ({
                                    ...prev,
                                    [optionName]: option.id,
                                  }))
                                }}
                                className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                                  selectedOptions[optionName] === option.id
                                    ? 'border-primary text-primary bg-primary/10'
                                    : 'border-gray-300 bg-white hover:border-gray-400'
                                } ${
                                  Number(option.option_stock) <= 0
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                } `}
                                disabled={Number(option.option_stock) <= 0}
                              >
                                <div className='text-left'>
                                  <div className='font-semibold'>
                                    {option.option_value}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    {priceFormatter.format(
                                      Number(option.option_price),
                                    )}
                                  </div>
                                  <div className='text-xs text-gray-400'>
                                    Stock: {option.option_stock}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Quantity
                    </label>
                    <div className='flex items-center space-x-3'>
                      <button
                        type='button'
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        className='hover:bg-primary/10 flex size-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white disabled:cursor-not-allowed disabled:opacity-50'
                        disabled={quantity <= 1}
                      >
                        -
                      </button>

                      <input
                        type='number'
                        min='1'
                        max={getMaxStock()}
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1
                          const maxStock = getMaxStock()
                          setQuantity(Math.min(Math.max(1, value), maxStock))
                        }}
                        className='focus:border-primary focus:ring-primary w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none'
                      />

                      <button
                        type='button'
                        onClick={() =>
                          setQuantity((prev) =>
                            Math.min(getMaxStock(), prev + 1),
                          )
                        }
                        className='hover:bg-primary/10 flex size-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white disabled:cursor-not-allowed disabled:opacity-50'
                        disabled={quantity >= getMaxStock()}
                      >
                        +
                      </button>

                      <span className='text-xs text-gray-500'>
                        Max: {getMaxStock()}
                      </span>
                    </div>
                  </div>

                  <Button
                    type='submit'
                    size='lg'
                    className='w-full py-3 text-lg'
                    disabled={
                      !Object.keys(selectedOptions || {}).length || !quantity
                    }
                  >
                    Add to Cart
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className='p-5'>
              <span>{product?.description}</span>
            </div>
          </div>
        </div>
      </div>
    </IndexLayout>
  )
}

export default ProductPage
