'use client'

import { getProductsByCategory } from '@/actions/products'
import { Footer } from '@/components/Layout/Footer'
import { Header } from '@/components/Layout/Header'
import { Menu } from '@/components/Layout/Menu'
import { ProductCard } from '@/components/Products/ProductCard'
import { AuthPanel } from '@/components/Protected/LoginPanel'
import { Product } from '@/types/product'
import { useQuery } from '@tanstack/react-query'
import { use } from 'react'

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const { data, error } = useQuery({
    queryKey: [`products/${slug}`],
    queryFn: async () => {
      return await getProductsByCategory(slug)
    },
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div className='flex min-h-screen flex-col items-center bg-[#dda700]'>
      <Header />
      <Menu />

      <div className='flex w-full gap-5 px-10 py-5'>
        <div className='flex-1/2'>
          {error && (
            <div className='py-16 text-center'>
              <div className='inline-block rounded-lg bg-red-100 p-4 text-red-700'>
                Error loading products. Please try again.
              </div>
            </div>
          )}

          {data && data.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {data?.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : data && data.length === 0 ? (
            <div className='py-16 text-center'>
              <div className='inline-block rounded-lg bg-white/10 p-8'>
                <div className='mb-4 text-6xl text-white/60'>📦</div>
                <h3 className='mb-2 text-xl font-semibold text-white'>
                  No products found in this category
                </h3>
                <p className='text-white/80'>
                  We&apos;re constantly adding new products. Please check back
                  soon.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <AuthPanel />
      </div>

      <Footer />
    </div>
  )
}
