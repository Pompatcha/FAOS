import { Loader } from 'lucide-react'

interface LoadingProps {
  isLoading: boolean
}

const Loading = ({ isLoading }: LoadingProps) => {
  if (!isLoading) return null

  return (
    <div className='fixed inset-0 `z-9999` flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='flex flex-col items-center space-y-2'>
        <Loader className='h-8 w-8 animate-spin text-white' />
      </div>
    </div>
  )
}

export { Loading }
