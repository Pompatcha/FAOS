'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Menu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const menuItems = [
    {
      title: 'Home',
      href: '',
    },
    {
      title: 'Honey',
      submenu: [
        { title: 'Pine', href: '' },
        { title: 'Flower', href: '' },
        { title: 'Thyme', href: '' },
        { title: 'Oak and Forest', href: '' },
        { title: 'Orange Blossom', href: '' },
        { title: '“PEARL FIR”', href: '' },
        { title: 'Vanilla', href: '' },
      ],
    },
    {
      title: 'Olive oil',
    },
    {
      title: 'Organics skin care',
      submenu: [
        { title: 'Lotions', href: '' },
        { title: 'Face and Hair', href: '' },
      ],
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

  return (
    <nav className='w-screen border-8 border-[#e2b007] bg-[#e2b007] shadow-lg'>
      <div className='flex justify-center'>
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
    </nav>
  )
}

export { Menu }
