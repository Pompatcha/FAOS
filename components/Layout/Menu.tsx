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

const NAVIGATION_MENU_ITEMS: MenuItem[] = [
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
    ],
  },
]

const COMPANY_NAME = 'FAOS Co.,Ltd.'
const LOGO_CONFIG = {
  src: '/logo.png',
  alt: 'FAOS Logo',
  width: 120,
  height: 120,
}

const HOVER_DELAY_MS = 150
const MOBILE_BREAKPOINT_PX = 1024

const Menu = () => {
  const router = useRouter()
  const [activeDesktopSubmenu, setActiveDesktopSubmenu] = useState<
    string | null
  >(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMobileSubmenuTitle, setExpandedMobileSubmenuTitle] = useState<
    string | null
  >(null)
  const submenuHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const clearSubmenuTimeout = useCallback(() => {
    if (submenuHoverTimeoutRef.current) {
      clearTimeout(submenuHoverTimeoutRef.current)
      submenuHoverTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth >= MOBILE_BREAKPOINT_PX) {
        setIsMobileMenuOpen(false)
        setExpandedMobileSubmenuTitle(null)
      }
    }

    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  useEffect(() => {
    const documentBody = document.body
    documentBody.style.overflow = isMobileMenuOpen ? 'hidden' : ''

    return () => {
      documentBody.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    return () => {
      clearSubmenuTimeout()
    }
  }, [clearSubmenuTimeout])

  const handleMainMenuItemClick = useCallback(
    (menuItemHref?: string, hasSubmenu: boolean = false) => {
      if (!hasSubmenu && menuItemHref) {
        router.push(menuItemHref)
        setActiveDesktopSubmenu(null)
        setIsMobileMenuOpen(false)
      }
    },
    [router],
  )

  const handleSubmenuItemClick = useCallback(
    (submenuItemHref: string) => {
      router.push(submenuItemHref)
      setActiveDesktopSubmenu(null)
      setIsMobileMenuOpen(false)
      setExpandedMobileSubmenuTitle(null)
    },
    [router],
  )

  const handleDesktopSubmenuMouseEnter = useCallback(
    (menuTitle: string) => {
      clearSubmenuTimeout()
      setActiveDesktopSubmenu(menuTitle)
    },
    [clearSubmenuTimeout],
  )

  const handleDesktopSubmenuMouseLeave = useCallback(() => {
    clearSubmenuTimeout()

    submenuHoverTimeoutRef.current = setTimeout(() => {
      setActiveDesktopSubmenu(null)
      submenuHoverTimeoutRef.current = null
    }, HOVER_DELAY_MS)
  }, [clearSubmenuTimeout])

  const handleMobileSubmenuToggle = useCallback((menuTitle: string) => {
    setExpandedMobileSubmenuTitle((previousExpandedTitle) =>
      previousExpandedTitle === menuTitle ? null : menuTitle,
    )
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((previousState) => !previousState)
  }, [])

  const getDesktopSubmenuClassName = (isSubmenuActive: boolean) => {
    const baseClasses =
      'bg-primary absolute top-full left-0 z-50 min-w-[200px] origin-top rounded-xl border-2 border-[#f3d27a] shadow-xl transition-all duration-200'
    const activeClasses = 'visible scale-y-100 opacity-100'
    const inactiveClasses = 'invisible scale-y-0 opacity-0'

    return `${baseClasses} ${isSubmenuActive ? activeClasses : inactiveClasses}`
  }

  const getMobileSubmenuClassName = (isSubmenuExpanded: boolean) => {
    const baseClasses = 'overflow-hidden transition-all duration-300'
    const expandedClasses = 'max-h-96 opacity-100'
    const collapsedClasses = 'max-h-0 opacity-0'

    return `${baseClasses} ${isSubmenuExpanded ? expandedClasses : collapsedClasses}`
  }

  const getMobileSidebarClassName = (isMenuOpen: boolean) => {
    const baseClasses =
      'bg-primary fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] transform border-l-8 border-[#f3d27a] shadow-2xl transition-transform duration-300 lg:hidden'
    const openClasses = 'translate-x-0'
    const closedClasses = 'translate-x-full'

    return `${baseClasses} ${isMenuOpen ? openClasses : closedClasses}`
  }

  const renderDesktopSubmenuDropdown = useMemo(
    () =>
      // eslint-disable-next-line react/no-unstable-nested-components
      function (menuItem: MenuItem) {
        if (!menuItem.submenu) return null

        const isCurrentSubmenuActive = activeDesktopSubmenu === menuItem.title

        return (
          <div
            className={getDesktopSubmenuClassName(isCurrentSubmenuActive)}
            onMouseEnter={() => handleDesktopSubmenuMouseEnter(menuItem.title)}
            onMouseLeave={handleDesktopSubmenuMouseLeave}
          >
            <div className='py-2'>
              {menuItem.submenu.map((submenuItem) => (
                <button
                  key={submenuItem.href}
                  onClick={() => handleSubmenuItemClick(submenuItem.href)}
                  className='hover:bg-primary/80 block w-full cursor-pointer px-4 py-3 text-left text-white transition-colors duration-150 hover:underline'
                  type='button'
                >
                  {submenuItem.title}
                </button>
              ))}
            </div>
          </div>
        )
      },
    [
      activeDesktopSubmenu,
      handleDesktopSubmenuMouseEnter,
      handleDesktopSubmenuMouseLeave,
      handleSubmenuItemClick,
    ],
  )

  const renderMobileSubmenuContent = useCallback(
    (menuItem: MenuItem) => {
      if (!menuItem.submenu) return null

      const isCurrentSubmenuExpanded =
        expandedMobileSubmenuTitle === menuItem.title

      return (
        <div className={getMobileSubmenuClassName(isCurrentSubmenuExpanded)}>
          <div className='bg-primary/80'>
            {menuItem.submenu.map((submenuItem) => (
              <button
                key={submenuItem.href}
                onClick={() => handleSubmenuItemClick(submenuItem.href)}
                className='hover:bg-primary/60 block w-full px-8 py-3 text-left text-white/90 transition-colors duration-150'
                type='button'
              >
                - {submenuItem.title}
              </button>
            ))}
          </div>
        </div>
      )
    },
    [expandedMobileSubmenuTitle, handleSubmenuItemClick],
  )

  const renderChevronIcon = (menuTitle: string, isMobile: boolean = false) => {
    const isExpanded = isMobile
      ? expandedMobileSubmenuTitle === menuTitle
      : activeDesktopSubmenu === menuTitle

    return (
      <ChevronDown
        className={`transition-transform duration-${isMobile ? '300' : '200'} ${
          isExpanded ? 'rotate-180' : ''
        }`}
        aria-hidden='true'
      />
    )
  }

  return (
    <div className='sticky top-0 z-40'>
      <div className='bg-secondary flex w-full justify-center'>
        <Image
          src={LOGO_CONFIG.src}
          width={LOGO_CONFIG.width}
          height={LOGO_CONFIG.height}
          alt={LOGO_CONFIG.alt}
          priority
          className='object-contain'
        />
      </div>

      <nav className='bg-primary w-full p-2.5 shadow-lg'>
        {/* Desktop Navigation */}
        <div className='hidden justify-center lg:flex'>
          {NAVIGATION_MENU_ITEMS.map((menuItem) => {
            const hasSubmenu = Boolean(menuItem.submenu)

            return (
              <div
                key={menuItem.title}
                className='group relative'
                onMouseEnter={
                  hasSubmenu
                    ? () => handleDesktopSubmenuMouseEnter(menuItem.title)
                    : undefined
                }
                onMouseLeave={
                  hasSubmenu ? handleDesktopSubmenuMouseLeave : undefined
                }
              >
                <button
                  className='hover:bg-primary/80 flex cursor-pointer items-center gap-2 px-6 py-4 font-bold text-white transition-colors duration-200 hover:underline'
                  onClick={() =>
                    handleMainMenuItemClick(menuItem.href, hasSubmenu)
                  }
                  type='button'
                >
                  <span className='font-medium whitespace-nowrap'>
                    {menuItem.title}
                  </span>
                  {hasSubmenu && renderChevronIcon(menuItem.title, false)}
                </button>

                {renderDesktopSubmenuDropdown(menuItem)}
              </div>
            )
          })}
        </div>

        {/* Mobile Navigation Header */}
        <div className='flex items-center justify-between px-4 py-3 lg:hidden'>
          <span className='text-lg font-bold text-white'>{COMPANY_NAME}</span>
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
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu Sidebar */}
        <div className={getMobileSidebarClassName(isMobileMenuOpen)}>
          <div className='flex items-center justify-end p-4'>
            <button
              onClick={closeMobileMenu}
              className='hover:bg-primary/80 rounded p-2 text-white transition-colors duration-200'
              aria-label='Close mobile menu'
              type='button'
            >
              <X className='h-6 w-6' />
            </button>
          </div>

          <div className='h-full overflow-y-auto pb-20'>
            {NAVIGATION_MENU_ITEMS.map((menuItem) => {
              const hasSubmenu = Boolean(menuItem.submenu)

              return (
                <div key={menuItem.title}>
                  <button
                    className='hover:bg-primary/80 flex w-full items-center justify-between px-4 py-4 text-left font-medium text-white transition-colors duration-200'
                    onClick={() => {
                      if (hasSubmenu) {
                        handleMobileSubmenuToggle(menuItem.title)
                      } else {
                        handleMainMenuItemClick(menuItem.href, hasSubmenu)
                      }
                    }}
                    type='button'
                  >
                    <span>{menuItem.title}</span>
                    {hasSubmenu && renderChevronIcon(menuItem.title, true)}
                  </button>

                  {renderMobileSubmenuContent(menuItem)}
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
