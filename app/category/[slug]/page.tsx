import { use } from 'react'

import { IndexLayout } from '@/components/Layout/Index'
import { NatureGoldBanner } from '@/components/NatureGoldBanner'
import { ProductCard } from '@/components/ProductCard'

const CategoryPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params)

  return (
    <IndexLayout>
      <NatureGoldBanner />

      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </IndexLayout>
  )
}

export default CategoryPage
