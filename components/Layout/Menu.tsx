'use client'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import { getCategories } from '@/actions/category'
import { useAuth } from '@/contexts/AuthContext.tsx'

import GoogleTranslate from '../GoogleTranslate'

interface SubMenuItem {
  title: string
  href?: string
  onClick?: () => void
}

interface MenuItem {
  title: string
  href?: string
  onClick?: () => void
  submenu?: SubMenuItem[]
}

const Menu = () => {
  const { user, signOut } = useAuth()
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })

  const router = useRouter()
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMobileSubmenu, setExpandedMobileSubmenu] = useState<
    string | null
  >(null)

  const getNavigationMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [{ title: 'Home', href: '/' }]

    if (categories?.data) {
      const categoryItems = categories.data.map((category) => ({
        title: category.name,
        href: `/category/${category.id}`,
      }))
      baseItems.push(...categoryItems)
    }

    baseItems.push(
      { title: 'Our Shop', href: '/ourshop' },
      { title: 'About me', href: '/about' },
    )

    if (!user) {
      baseItems.push({ title: 'Login/Register', href: '/login' })
    }

    if (user) {
      baseItems.push(
        {
          title: 'Control Panel',
          submenu: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Products', href: '/dashboard/products' },
            { title: 'Orders', href: '/dashboard/orders' },
          ],
        },
        { title: 'Logout', onClick: signOut },
      )
    }

    return baseItems
  }

  const NAVIGATION_MENU_ITEMS = getNavigationMenuItems()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
        setExpandedMobileSubmenu(null)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const navigateTo = (href: string) => {
    router.push(href)
    setActiveSubmenu(null)
    setIsMobileMenuOpen(false)
    setExpandedMobileSubmenu(null)
  }

  const handleMenuClick = (item: MenuItem | SubMenuItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (item.href) {
      navigateTo(item.href)
    }

    setActiveSubmenu(null)
    setIsMobileMenuOpen(false)
    setExpandedMobileSubmenu(null)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleMobileSubmenu = (title: string) => {
    setExpandedMobileSubmenu(expandedMobileSubmenu === title ? null : title)
  }

  return (
    <div className='sticky top-0 z-40'>
      {/* Logo Section */}
      <div className='bg-secondary flex w-full justify-center'>
        <Image
          src='/logo.png'
          width={120}
          height={120}
          alt='FAOS Logo'
          priority
          className='object-contain'
        />
      </div>

      <div className='absolute top-5 right-5'>
        <GoogleTranslate />
      </div>

      <nav className='bg-primary w-full p-2.5 shadow-lg'>
        {/* Desktop Navigation */}
        <div className='hidden justify-center lg:flex'>
          {NAVIGATION_MENU_ITEMS.map((item) => (
            <div
              key={item.title}
              className='group relative'
              onMouseEnter={() => item.submenu && setActiveSubmenu(item.title)}
              onMouseLeave={() => item.submenu && setActiveSubmenu(null)}
            >
              <button
                className='hover:bg-primary/80 flex cursor-pointer items-center gap-2 px-6 py-4 font-bold text-white transition-colors duration-200 hover:underline'
                onClick={() => !item.submenu && handleMenuClick(item)}
                type='button'
              >
                <span className='font-medium whitespace-nowrap'>
                  {item.title}
                </span>
                {item.submenu && (
                  <ChevronDown
                    className={`transition-transform duration-200 ${
                      activeSubmenu === item.title ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Desktop Submenu */}
              {item.submenu && (
                <div
                  className={`bg-primary absolute top-full left-0 z-50 min-w-[200px] origin-top rounded-xl border-2 border-[#f3d27a] shadow-xl transition-all duration-200 ${
                    activeSubmenu === item.title
                      ? 'visible scale-y-100 opacity-100'
                      : 'invisible scale-y-0 opacity-0'
                  }`}
                >
                  <div className='py-2'>
                    {item.submenu.map((subItem, index) => (
                      <button
                        key={subItem.href || subItem.title || index}
                        onClick={() => handleMenuClick(subItem)}
                        className='hover:bg-primary/80 block w-full cursor-pointer px-4 py-3 text-left text-white transition-colors duration-150 hover:underline'
                        type='button'
                      >
                        {subItem.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Navigation Header */}
        <div className='flex items-center justify-between px-4 py-3 lg:hidden'>
          <span className='text-lg font-bold text-white'>FAOS Co.,Ltd.</span>
          <button
            onClick={toggleMobileMenu}
            className='hover:bg-primary/80 p-2 text-white transition-colors duration-200'
            aria-label='Toggle mobile menu'
            type='button'
          >
            {isMobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <MenuIcon className='h-6 w-6' />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className='fixed inset-0 z-40 bg-black/50 lg:hidden'
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Sidebar */}
        <div
          className={`bg-primary fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] transform border-l-8 border-[#f3d27a] shadow-2xl transition-transform duration-300 lg:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className='flex items-center justify-end p-4'>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className='hover:bg-primary/80 rounded p-2 text-white transition-colors duration-200'
              aria-label='Close mobile menu'
              type='button'
            >
              <X className='h-6 w-6' />
            </button>
          </div>

          <div className='h-full overflow-y-auto pb-20'>
            {NAVIGATION_MENU_ITEMS.map((item) => (
              <div key={item.title}>
                <button
                  className='hover:bg-primary/80 flex w-full items-center justify-between px-4 py-4 text-left font-medium text-white transition-colors duration-200'
                  onClick={() => {
                    if (item.submenu) {
                      toggleMobileSubmenu(item.title)
                    } else {
                      handleMenuClick(item)
                    }
                  }}
                  type='button'
                >
                  <span>{item.title}</span>
                  {item.submenu && (
                    <ChevronDown
                      className={`transition-transform duration-300 ${
                        expandedMobileSubmenu === item.title ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Mobile Submenu */}
                {item.submenu && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedMobileSubmenu === item.title
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className='bg-primary/80'>
                      {item.submenu.map((subItem, index) => (
                        <button
                          key={subItem.href || subItem.title || index}
                          onClick={() => handleMenuClick(subItem)}
                          className='hover:bg-primary/60 block w-full px-8 py-3 text-left text-white/90 transition-colors duration-150'
                          type='button'
                        >
                          - {subItem.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

export { Menu }
