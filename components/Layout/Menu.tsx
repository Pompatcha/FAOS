'use client'
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'

interface SubMenuItem {
  title: string
  href: string
}

interface MenuItem {
  title: string
  href?: string
  submenu?: SubMenuItem[]
}

const MENU_ITEMS: MenuItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Honey', href: '/category/honey' },
  { title: 'Olive oil', href: '/category/olive-oil' },
  { title: 'Organic skin care', href: '/category/organic-skin-care' },
  {
    title: 'Our Shop',
    href: '/ourshop',
  },
  { title: 'About me', href: '/about' },
  {
    title: 'Admin Control',
    href: '/',
    submenu: [
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Products', href: '/dashboard/products' },
      { title: 'Orders', href: '/dashboard/orders' },
      { title: 'Customers', href: '/dashboard/customers' },
    ],
  },
]

const Menu = () => {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMobileSubmenu, setExpandedMobileSubmenu] = useState<
    string | null
  >(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleMenuClick = useCallback(
    (href?: string, hasSubmenu: boolean = false) => {
      if (!hasSubmenu && href) {
        router.push(href)
        setActiveMenu(null)
        setIsMobileMenuOpen(false)
      }
    },
    [router],
  )

  const handleSubmenuClick = useCallback(
    (href: string) => {
      router.push(href)
      setActiveMenu(null)
      setIsMobileMenuOpen(false)
      setExpandedMobileSubmenu(null)
    },
    [router],
  )

  const handleMenuEnter = useCallback((menuTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveMenu(menuTitle)
  }, [])

  const handleMenuLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
      timeoutRef.current = null
    }, 150)
  }, [])

  const toggleMobileSubmenu = useCallback((menuTitle: string) => {
    setExpandedMobileSubmenu((prev) => (prev === menuTitle ? null : menuTitle))
  }, [])

  const renderDesktopSubmenu = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item: MenuItem) => {
      if (!item.submenu) return null

      const isActive = activeMenu === item.title

      return (
        <div
          className={`bg-primary absolute top-full left-0 z-50 min-w-[200px] origin-top rounded-xl border-2 shadow-xl transition-all duration-200 ${
            isActive
              ? 'visible scale-y-100 opacity-100'
              : 'invisible scale-y-0 opacity-0'
          }`}
          onMouseEnter={() => handleMenuEnter(item.title)}
          onMouseLeave={handleMenuLeave}
        >
          <div className='py-2'>
            {item.submenu.map((subItem) => (
              <button
                key={subItem.href}
                onClick={() => handleSubmenuClick(subItem.href)}
                className='hover:bg-primary/80 block w-full cursor-pointer px-4 py-3 text-left text-white transition-colors duration-150 hover:underline'
              >
                {subItem.title}
              </button>
            ))}
          </div>
        </div>
      )
    },
    [activeMenu, handleMenuEnter, handleMenuLeave, handleSubmenuClick],
  )

  const renderMobileSubmenu = useCallback(
    (item: MenuItem) => {
      if (!item.submenu) return null

      const isExpanded = expandedMobileSubmenu === item.title

      return (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='bg-primary/80'>
            {item.submenu.map((subItem) => (
              <button
                key={subItem.href}
                onClick={() => handleSubmenuClick(subItem.href)}
                className='hover:bg-primary/60 block w-full px-8 py-3 text-left text-white/90 transition-colors duration-150'
              >
                - {subItem.title}
              </button>
            ))}
          </div>
        </div>
      )
    },
    [expandedMobileSubmenu, handleSubmenuClick],
  )

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className='sticky top-0 z-40'>
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

      <nav className='bg-primary w-full p-2.5 shadow-lg'>
        <div className='hidden justify-center lg:flex'>
          {MENU_ITEMS.map((item) => {
            const hasSubmenu = Boolean(item.submenu)

            return (
              <div
                key={item.title}
                className='group relative'
                onMouseEnter={
                  hasSubmenu ? () => handleMenuEnter(item.title) : undefined
                }
                onMouseLeave={hasSubmenu ? handleMenuLeave : undefined}
              >
                <button
                  className='hover:bg-primary/80 flex cursor-pointer items-center gap-2 px-6 py-4 font-bold text-white transition-colors duration-200 hover:underline'
                  onClick={() => handleMenuClick(item.href, hasSubmenu)}
                  type='button'
                >
                  <span className='font-medium whitespace-nowrap'>
                    {item.title}
                  </span>
                  {hasSubmenu && (
                    <ChevronDown
                      className={`transition-transform duration-200 ${
                        activeMenu === item.title ? 'rotate-180' : ''
                      }`}
                      aria-hidden='true'
                    />
                  )}
                </button>

                {renderDesktopSubmenu(item)}
              </div>
            )
          })}
        </div>

        <div className='flex items-center justify-between px-4 py-3 lg:hidden'>
          <span className='text-lg font-bold text-white'>FAOS Co.,Ltd.</span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='hover:bg-primary/80 p-2 text-white transition-colors duration-200'
            aria-label='Toggle mobile menu'
          >
            {isMobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <MenuIcon className='h-6 w-6' />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            className='fixed inset-0 z-40 bg-black/50 lg:hidden'
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div
          className={`bg-primary fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] transform border-l-8 shadow-2xl transition-transform duration-300 lg:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className='flex items-center justify-end p-4'>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className='hover:bg-primary/80 rounded p-2 text-white transition-colors duration-200'
              aria-label='Close mobile menu'
            >
              <X className='h-6 w-6' />
            </button>
          </div>

          <div className='h-full overflow-y-auto pb-20'>
            {MENU_ITEMS.map((item) => {
              const hasSubmenu = Boolean(item.submenu)

              return (
                <div key={item.title}>
                  <button
                    className='hover:bg-primary/80 flex w-full items-center justify-between px-4 py-4 text-left font-medium text-white transition-colors duration-200'
                    onClick={() => {
                      if (hasSubmenu) {
                        toggleMobileSubmenu(item.title)
                      } else {
                        handleMenuClick(item.href, hasSubmenu)
                      }
                    }}
                    type='button'
                  >
                    <span>{item.title}</span>
                    {hasSubmenu && (
                      <ChevronDown
                        className={`transition-transform duration-300 ${
                          expandedMobileSubmenu === item.title
                            ? 'rotate-180'
                            : ''
                        }`}
                        aria-hidden='true'
                      />
                    )}
                  </button>

                  {renderMobileSubmenu(item)}
                </div>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}

export { Menu }
