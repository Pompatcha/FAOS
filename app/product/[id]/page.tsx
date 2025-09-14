'use client'
import { useQuery } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { use } from 'react'

import { getProduct } from '@/actions/product'
import { ImageSlider } from '@/components/ImageSlider'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { priceFormatter } from '@/lib/number'

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)

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
