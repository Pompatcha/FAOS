'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { use, useState } from 'react'
import { toast } from 'sonner'

import type { ProductOptionInput } from '@/actions/product'

import { addToCart } from '@/actions/cart'
import { getProduct } from '@/actions/product'
import { ImageSlider } from '@/components/ImageSlider'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext.tsx'
import { priceFormatter } from '@/lib/number'

interface ProductOptionWithId extends ProductOptionInput {
  id: number
}

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)
  const { user } = useAuth()
  const queryClient = useQueryClient()

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

  const getSelectedOption = () => {
    if (!product?.options || product.options.length === 0) {
      return null
    }

    const selectedOptionIds = Object.values(selectedOptions)
    if (selectedOptionIds.length === 0) {
      return null
    }

    return product.options.find((option: { id: number }) =>
      selectedOptionIds.includes(option.id),
    )
  }

  const getCurrentPrice = () => {
    const selectedOption = getSelectedOption()
    if (selectedOption) {
      return Number(selectedOption.option_price)
    }
    return product?.min_price || 0
  }

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product/detail', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  })

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Product added to cart successfully!')
        queryClient.invalidateQueries({
          queryKey: ['cart', user?.id],
          exact: true,
        })
        queryClient.invalidateQueries({
          queryKey: ['cart/count', user?.id],
          exact: true,
        })
      } else {
        toast.error(result.message || 'Failed to add product to cart')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An error occurred while adding to cart')
    },
  })

  const handleAddToCart = () => {
    if (!user?.id) {
      toast.error('Please login to add items to cart')
      return
    }

    if (!product) {
      toast.error('Product not found')
      return
    }

    if (product.options && product.options.length > 0) {
      const optionGroups = (product.options as ProductOptionWithId[]).reduce(
        (acc: { [key: string]: ProductOptionWithId[] }, option) => {
          if (!acc[option.option_name]) {
            acc[option.option_name] = []
          }
          acc[option.option_name].push(option)
          return acc
        },
        {},
      )

      const requiredOptionsCount = Object.keys(optionGroups).length
      const selectedOptionsCount = Object.keys(selectedOptions).length

      if (selectedOptionsCount < requiredOptionsCount) {
        toast.error('Please select all required options')
        return
      }
    }

    const selectedOption = getSelectedOption()
    const cartData = {
      product_id: Number(id),
      product_option_id: selectedOption?.id || null,
      quantity,
      unit_price: getCurrentPrice(),
      user_id: user.id,
    }

    addToCartMutation.mutate(cartData)
  }

  const images =
    Array.isArray(product?.images) && product?.images.length > 0
      ? product?.images?.flatMap(
          (image: { image_url: string }) => image?.image_url,
        )
      : ['/placeholder.svg']

  const isAddToCartDisabled = () => {
    if (!user?.id) return false
    if (addToCartMutation.isPending) return true
    if (quantity <= 0 || quantity > getMaxStock()) return true

    if (product?.options && product.options.length > 0) {
      const optionGroups = (product.options as ProductOptionWithId[]).reduce(
        (acc: { [key: string]: ProductOptionWithId[] }, option) => {
          if (!acc[option.option_name]) {
            acc[option.option_name] = []
          }
          acc[option.option_name].push(option)
          return acc
        },
        {},
      )

      const requiredOptionsCount = Object.keys(optionGroups).length
      const selectedOptionsCount = Object.keys(selectedOptions).length

      if (selectedOptionsCount < requiredOptionsCount) return true
    }

    return false
  }

  return (
    <IndexLayout>
      <SearchBar />
      <Loading isLoading={productLoading} />

      <div className='flex flex-col gap-5'>
        <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
          <ImageSlider images={images} />

          <div className='h-fit rounded-xl border-4 border-[#f3d27a] bg-gradient-to-r from-[#f9e6b3] to-[#f3d27a]'>
            <div className='flex flex-col gap-2.5 p-5'>
              <div className='text-[#4a2c00]'>
                <h1 className='mb-2 text-3xl font-bold'>{product?.name}</h1>
                <p className='text-lg'>{product?.short_description}</p>
              </div>

              <div className='flex items-center gap-2 text-red-800'>
                <span className='text-3xl font-bold'>
                  {(() => {
                    const selectedOption = getSelectedOption()

                    if (selectedOption) {
                      return priceFormatter.format(
                        Number(selectedOption.option_price),
                      )
                    }

                    if (product?.min_price && product?.max_price) {
                      return product.min_price === product.max_price
                        ? priceFormatter.format(product.min_price)
                        : `${priceFormatter.format(product.min_price)} - ${priceFormatter.format(product.max_price)} (Depends on size)`
                    }

                    return 'n/a'
                  })()}
                </span>
              </div>
            </div>

            <Card className='shadow-2xl'>
              <CardContent className='p-5'>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAddToCart()
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
                          <Select
                            value={
                              selectedOptions[optionName]?.toString() || ''
                            }
                            onValueChange={(value) => {
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [optionName]: Number(value),
                              }))
                            }}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue
                                placeholder={`Select ${optionName}`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((option: ProductOptionWithId) => (
                                <SelectItem
                                  key={option.id}
                                  value={option.id.toString()}
                                  disabled={Number(option.option_stock) <= 0}
                                >
                                  <div className='flex items-center justify-between gap-4'>
                                    <span className='font-medium'>
                                      {option.option_value}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                    disabled={isAddToCartDisabled()}
                  >
                    {addToCartMutation.isPending
                      ? 'Adding to Cart...'
                      : !user?.id
                        ? 'Login to Add to Cart'
                        : 'Add to Cart'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {product?.description && (
          <section className='flex flex-col'>
            <div className='bg-secondary flex w-full flex-col rounded-t-lg p-2.5 text-center shadow'>
              <h2 className='text-2xl font-bold text-red-800'>
                Product Description
              </h2>
            </div>

            <div className='flex w-full flex-col items-center gap-5 rounded-b-lg bg-white p-5 sm:flex-row'>
              <div className='w-full text-lg'>{product?.description}</div>
            </div>
          </section>
        )}
      </div>
    </IndexLayout>
  )
}

export default ProductPage
