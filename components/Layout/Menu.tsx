'use client'
import { useState } from 'react'
import { ChevronDown, ShoppingCart, User } from 'lucide-react'
import { Profile } from '../Homepage/Profile'
import { useRouter } from 'next/navigation'
import Cart from '../Products/Cart'
import { useCartCount } from '@/hooks/use-carts'

const Menu = () => {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const { data: cartCount = 0 } = useCartCount()

  const menuItems = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Honey',
      href: '/category/honey',
    },
    {
      title: 'Olive oil',
      href: '/category/olive-oil',
    },
    {
      title: 'Organic skin care',
      href: '/category/organic-skin-care',
    },
    {
      title: 'Our Shop',
      submenu: [
        { title: 'Bangkok', href: '/our-shop/bangkok' },
        { title: 'Pattaya', href: '/our-shop/pattaya' },
        { title: 'Chiang Mai', href: '/our-shop/chiang-mai' },
        { title: 'Phuket', href: '/our-shop/phuket' },
        { title: 'Krabi', href: '/our-shop/krabi' },
        { title: 'Prachinburi', href: '/our-shop/prachinburi' },
        { title: 'Hua Hin', href: '/our-shop/hua-hin' },
      ],
    },
    {
      title: 'About me',
      href: '/about',
    },
  ]

  const handleMenuClick = (
    href: string | undefined,
    hasSubmenu: boolean = false,
  ) => {
    if (!hasSubmenu && href) {
      router.push(href)
      setActiveMenu(null)
    }
  }

  const handleSubmenuClick = (href: string) => {
    router.push(href)
    setActiveMenu(null)
  }

  const handleMenuHover = (menuId: string) => {
    setActiveMenu(menuId)
  }

  const handleMenuLeave = () => {
    setTimeout(() => {
      setActiveMenu(null)
    }, 150)
  }

  const handleProfileClick = () => {
    setIsProfileOpen(true)
  }

  const handleCartClick = () => {
    setIsCartOpen(true)
  }

  return (
    <>
      <nav className='sticky top-0 z-50 w-full border-8 border-[#e2b007] bg-[#e2b007] shadow-lg'>
        <div className='item flex justify-center'>
          {menuItems.map((item) => (
            <div
              key={item.title}
              className='group relative'
              onMouseEnter={() => item.submenu && handleMenuHover(item.title)}
              onMouseLeave={() => item.submenu && handleMenuLeave()}
            >
              <button
                className={`flex items-center gap-2 px-6 py-4 font-bold text-white transition-colors duration-200 hover:bg-[#f3d27a] hover:text-white`}
                onClick={() => handleMenuClick(item.href, !!item.submenu)}
              >
                <span className='font-medium whitespace-nowrap'>
                  {item.title}
                </span>
                {item.submenu && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeMenu === item.title ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {item.submenu && (
                <div
                  className={`absolute top-full left-0 z-50 min-w-[200px] origin-top border-2 border-[#f3d27a] bg-[#e2b007] shadow-xl transition-all duration-200 ${
                    activeMenu === item.title
                      ? 'visible scale-y-100 opacity-100'
                      : 'invisible scale-y-0 opacity-0'
                  } `}
                  onMouseEnter={() => setActiveMenu(item.title)}
                  onMouseLeave={handleMenuLeave}
                >
                  <div className='py-2'>
                    {item.submenu.map((subItem, index) => (
                      <button
                        key={index}
                        onClick={() => handleSubmenuClick(subItem.href)}
                        className='block w-full px-4 py-3 text-left text-white transition-colors duration-150 hover:bg-[#f3d27a] hover:text-white'
                      >
                        <span>{subItem.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='flex justify-center gap-4 pb-4'>
          <button
            onClick={handleProfileClick}
            className='z-40 size-13 rounded-full border-2 border-white bg-[#e2b007] p-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#f3d27a]'
            aria-label='Open profile'
          >
            <User className='h-6 w-6' />
          </button>

          <Profile
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
          />

          <button
            onClick={handleCartClick}
            className='z-40 size-13 rounded-full border-2 border-white bg-[#e2b007] p-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#f3d27a]'
            aria-label={`Open cart with ${cartCount} items`}
          >
            <div className='relative'>
              <ShoppingCart className='h-6 w-6' />
              {cartCount > 0 && (
                <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
          </button>
        </div>

        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </nav>
    </>
  )
}

export { Menu }
