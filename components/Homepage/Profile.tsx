'use client'

import { X, User, Package, Settings, LogOut, Heart, MapPin } from 'lucide-react'

interface ProfileProps {
  isOpen: boolean
  onClose: () => void
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

const Profile = ({ isOpen, onClose, user }: ProfileProps) => {
  const handleMenuClick = (action: string) => {
    console.log(`${action} clicked`)
    onClose()
  }

  const defaultUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  }

  const currentUser = user || defaultUser

  const menuItems = [
    {
      icon: Package,
      title: 'My Orders',
      action: 'orders',
      description: 'Check order status',
    },
    {
      icon: Heart,
      title: 'Favorites',
      action: 'favorites',
      description: 'Products you liked',
    },
    {
      icon: MapPin,
      title: 'Shipping Address',
      action: 'addresses',
      description: 'Manage delivery addresses',
    },
    {
      icon: Settings,
      title: 'Profile Settings',
      action: 'settings',
      description: 'Edit personal information',
    },
  ]

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50'>
      <div className='bg-opacity-50 absolute inset-0' onClick={onClose} />

      <div className='absolute right-10 bottom-0 max-h-[80vh] w-80 overflow-hidden rounded-t-lg bg-white shadow-2xl'>
        <div className='flex items-center justify-between border-b border-gray-200 p-4'>
          <h2 className='text-lg font-bold'>Profile</h2>
          <button
            onClick={onClose}
            className='transition-colors hover:text-gray-200'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='border-b border-gray-200 bg-gray-50 p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#e2b007] text-white'>
              <User className='h-6 w-6' />
            </div>
            <div>
              <h3 className='font-medium text-gray-900'>{currentUser.name}</h3>
              <p className='text-sm text-gray-600'>{currentUser.email}</p>
            </div>
          </div>
        </div>

        <div className='max-h-96 flex-1 overflow-y-auto'>
          <div className='space-y-1 p-2'>
            {menuItems.map((item) => (
              <button
                key={item.action}
                onClick={() => handleMenuClick(item.action)}
                className='flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-100'
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                  <item.icon className='h-5 w-5 text-gray-600' />
                </div>
                <div className='flex-1'>
                  <h4 className='font-medium text-gray-900'>{item.title}</h4>
                  <p className='text-xs text-gray-500'>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className='border-t border-gray-200 bg-gray-50 p-4'>
          <button
            onClick={() => handleMenuClick('logout')}
            className='flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-3 font-medium text-white transition-colors hover:bg-red-600'
          >
            <LogOut className='h-4 w-4' />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export { Profile }
