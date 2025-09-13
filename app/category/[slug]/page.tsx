'use client'

import { useQuery } from '@tanstack/react-query'
import { use } from 'react'

import { getCategoryByName } from '@/actions/category'
import { getProductsByCategory } from '@/actions/product'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
import { NatureGoldBanner } from '@/components/NatureGoldBanner'
import { ProductCard } from '@/components/ProductCard'

const CategoryPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params)

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => getCategoryByName(slug),
    enabled: !!slug,
  })

  const categoryData = category?.data
  const categoryId =
    categoryData && !Array.isArray(categoryData) ? categoryData.id : null

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['category/products', categoryId],
    queryFn: () => getProductsByCategory(categoryId),
    enabled: !!category,
  })

  return (
    <IndexLayout>
      <Loading isLoading={categoryLoading || productsLoading} />

      <NatureGoldBanner />

      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {!!products &&
          Array.isArray(products) &&
          products?.map((product) => {
            return <ProductCard key={product?.id} product={product} />
          })}
      </div>
    </IndexLayout>
  )
}

export default CategoryPage
