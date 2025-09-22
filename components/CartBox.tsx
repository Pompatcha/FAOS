import { useQuery } from '@tanstack/react-query'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { getCartCount } from '@/actions/cart'
import { useAuth } from '@/contexts/AuthContext.tsx'

const CartBox = () => {
  const router = useRouter()
  const { user } = useAuth()

  const { data: cartCount } = useQuery({
    queryKey: ['cart/count', user?.id],
    queryFn: () => getCartCount(user?.id || ''),
    enabled: !!user?.id,
  })

  return (
    <div
      className='relative cursor-pointer rounded-full border p-2'
      onClick={() => {
        router.push('/cart')
      }}
    >
      <div className='absolute -top-2.5 right-0 rounded-full bg-red-500 px-2 text-center text-white'>
        {cartCount?.data}
      </div>
      <ShoppingCart className='text-white' />
    </div>
  )
}

export { CartBox }
