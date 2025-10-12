'use client'

import {
  UserIcon,
  ChevronDown,
  User,
  LogOut,
  Box,
  PackageSearch,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

import { useAuth } from '@/contexts/AuthContext.tsx'

const ProfileBox = () => {
  const router = useRouter()
  const { signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const profileMenuItems = [
    {
      title: 'Profile',
      icon: User,
      onClick: () => {
        router.push('/dashboard/profile')
        setIsOpen(false)
      },
    },
    {
      title: 'Products (Admin only)',
      icon: PackageSearch,
      onClick: () => {
        router.push('/dashboard/products')
        setIsOpen(false)
      },
    },
    {
      title: 'Orders',
      icon: Box,
      onClick: () => {
        router.push('/dashboard/orders')
        setIsOpen(false)
      },
    },
    {
      title: 'Logout',
      icon: LogOut,
      onClick: () => {
        signOut()
        setIsOpen(false)
      },
    },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        className='hover:bg-primary/80 flex cursor-pointer items-center gap-2 rounded-full border p-2 transition-colors duration-200'
        onClick={() => setIsOpen(!isOpen)}
        type='button'
        aria-label='Profile menu'
      >
        <UserIcon className='text-white' />
        <ChevronDown
          className={`h-4 w-4 text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className='bg-primary absolute top-full right-0 z-50 mt-2 min-w-[250px] origin-top-right rounded-xl border-2 border-[#f3d27a] shadow-xl'>
          <div className='py-2'>
            {profileMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.title}
                  onClick={item.onClick}
                  className='hover:bg-primary/80 flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-white transition-colors duration-150 hover:underline'
                  type='button'
                >
                  <Icon className='h-4 w-4' />
                  <span>{item.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export { ProfileBox }
