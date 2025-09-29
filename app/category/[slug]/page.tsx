'use client'
import { useQuery } from '@tanstack/react-query'
import { Package } from 'lucide-react'
import { use } from 'react'

import { getProductsByCategory } from '@/actions/product'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
import { NatureGoldBanner } from '@/components/NatureGoldBanner'
import { ProductCard } from '@/components/ProductCard'

const CategoryPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params)

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['category/products', slug],
    queryFn: () => getProductsByCategory(slug),
    enabled: !!slug,
  })

  const hasProducts = products && Array.isArray(products) && products.length > 0

  return (
    <IndexLayout>
      <Loading isLoading={productsLoading} />

      <NatureGoldBanner />

      {hasProducts ? (
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {products.map((product) => {
            return <ProductCard key={product?.id} product={product} />
          })}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center rounded-xl bg-white py-12 text-center shadow-lg'>
          <Package className='text-muted-foreground mb-4 size-16' />
          <h3 className='text-foreground mb-2 text-lg font-semibold'>
            No products in this category
          </h3>
          <p className='text-muted-foreground max-w-sm'>
            We couldn&apos;t find any products in this category. Please check
            back later or browse other categories.
          </p>
        </div>
      )}
    </IndexLayout>
  )
}

export default CategoryPage
