import { Package } from 'lucide-react'

const Loading = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-[#fff9df]'>
      <div className='text-center'>
        <Package className='mx-auto mb-4 h-12 w-12 animate-spin text-[#dda700]' />
        <p>Loading your data...</p>
      </div>
    </div>
  )
}

export { Loading }
