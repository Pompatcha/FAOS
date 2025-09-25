import { UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ProfileBox = () => {
  const router = useRouter()

  return (
    <div
      className='relative cursor-pointer rounded-full border p-2'
      onClick={() => {
        router.push('/dashboard/profile')
      }}
    >
      <UserIcon className='text-white' />
    </div>
  )
}

export { ProfileBox }
