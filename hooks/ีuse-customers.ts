import { getCustomerProfile } from '@/actions/customers'
import { useAuth } from '@/contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'

const useCustomer = () => {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['customer/profile', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return []
      return await getCustomerProfile(profile.id)
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 30,
  })
}

export { useCustomer }
