'use client'

import { useQuery } from '@tanstack/react-query'
import { Package } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getProductsBySearch } from '@/actions/product'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
import { NatureGoldBanner } from '@/components/NatureGoldBanner'
import { ProductCard } from '@/components/ProductCard'
import { SearchBar } from '@/components/SearchBar'
import { useProductStore } from '@/stores/product'

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const ProductPage = () => {
  const { searchText } = useProductStore()

  const debouncedSearchText = useDebounce(searchText, 500)

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['search/products', debouncedSearchText],
    queryFn: () => getProductsBySearch(debouncedSearchText),
    enabled: !!debouncedSearchText && debouncedSearchText.length > 0,
  })

  const hasProducts = products && Array.isArray(products) && products.length > 0

  return (
    <IndexLayout>
      <SearchBar />
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
            There are no products in the search.
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

export default ProductPage
