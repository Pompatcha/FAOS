'use client'

import { useState } from 'react'
import { ChevronDown, ShoppingCart, User } from 'lucide-react'
import { Cart } from '../Products/Cart'
import { Profile } from '../Homepage/Profile'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

const Menu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Pine Honey', price: 350, quantity: 2 },
    { id: '2', name: 'Orange Blossom Honey', price: 420, quantity: 1 },
    { id: '3', name: 'Organic Face Lotion', price: 280, quantity: 1 },
  ])

  const menuItems = [
    {
      title: 'Home',
      href: '',
    },
    {
      title: 'Honey',
      href: '',
    },
    {
      title: 'Olive oil',
      href: '',
    },
    {
      title: 'Organics skin care',
      href: '',
    },
    {
      title: 'Our Shop',
      submenu: [
        { title: 'Bangkok', href: '' },
        { title: 'Pattaya', href: '' },
        { title: 'Chiang Mai', href: '' },
        { title: 'Phuket', href: '' },
        { title: 'Krabi', href: '' },
        { title: 'Prachinburi', href: '' },
        { title: 'Hua Hin', href: '' },
      ],
    },
    {
      title: 'About me',
      href: '',
    },
  ]

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId)
  }

  const handleMenuHover = (menuId: string) => {
    setActiveMenu(menuId)
  }

  const handleMenuLeave = () => {
    setActiveMenu(null)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    )
  }

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const handleProfileClick = () => {
    setIsProfileOpen(true)
  }

  return (
    <>
      <nav className='relative w-full border-8 border-[#e2b007] bg-[#e2b007] shadow-lg'>
        <div className='item flex justify-center'>
          {menuItems.map((item) => (
            <div
              key={item.title}
              className='group relative'
              onMouseEnter={() => item.submenu && handleMenuHover(item.title)}
              onMouseLeave={handleMenuLeave}
            >
              <button
                className={`flex items-center gap-2 px-6 py-4 font-bold text-white`}
                onClick={() =>
                  item.submenu ? handleMenuClick(item.title) : null
                }
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
                >
                  <div className='py-2'>
                    {item.submenu.map((subItem, index) => (
                      <a
                        key={index}
                        href={subItem.href}
                        className='block px-4 py-3 text-white transition-colors duration-150 hover:bg-[#f3d27a] hover:text-white'
                      >
                        <span>{subItem.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='flex justify-center gap-4'>
          <button
            onClick={handleProfileClick}
            className='top-4 right-4 z-40 rounded-full border-2 border-white bg-[#e2b007] p-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#f3d27a]'
          >
            <User className='h-6 w-6' />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className='top-4 right-4 z-40 rounded-full border-2 border-white bg-[#e2b007] p-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#f3d27a]'
          >
            <div className='relative'>
              <ShoppingCart className='h-6 w-6' />
              {getTotalItems() > 0 && (
                <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
                  {getTotalItems()}
                </span>
              )}
            </div>
          </button>
        </div>
      </nav>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />

      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={{
          name: 'Patcharin Chanaphukdee',
          email: 'customer@email.com',
        }}
      />
    </>
  )
}

export { Menu }
