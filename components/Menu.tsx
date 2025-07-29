"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const Menu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems = [
    {
      id: "home",
      title: "Home",
      href: "/",
    },
    {
      id: "products",
      title: "Products",
      submenu: [{ title: "Honey", href: "" }],
    },
    {
      id: "ourshop",
      title: "Our Shop",
      submenu: [
        { title: "Bangkok", href: "" },
        { title: "Pattaya", href: "" },
        { title: "Chiang Mai", href: "" },
        { title: "Phuket", href: "" },
        { title: "Krabi", href: "" },
        { title: "Prachinburi", href: "" },
        { title: "Hua Hin", href: "" },
      ],
    },
    {
      id: "about",
      title: "About me",
    },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const handleMenuHover = (menuId: string) => {
    setActiveMenu(menuId);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  return (
    <nav className="border-8 border-[#e2b007] bg-[#e2b007] shadow-lg">
      <div className="flex justify-center">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="relative group"
            onMouseEnter={() => item.submenu && handleMenuHover(item.id)}
            onMouseLeave={handleMenuLeave}
          >
            <button
              className={`
                flex items-center gap-2 px-6 py-4 text-white font-bold hover:bg-[#f3d27a]
                transition-all duration-200
                ${activeMenu === item.id ? "bg-[#f3d27a] text-white" : ""}
              `}
              onClick={() => (item.submenu ? handleMenuClick(item.id) : null)}
            >
              <span className="font-medium whitespace-nowrap">
                {item.title}
              </span>
              {item.submenu && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeMenu === item.id ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {item.submenu && (
              <div
                className={`
                absolute top-full left-0 min-w-[200px] bg-[#e2b007] border-2 border-[#f3d27a] shadow-xl z-50 
                transition-all duration-200 origin-top
                ${
                  activeMenu === item.id
                    ? "opacity-100 scale-y-100 visible"
                    : "opacity-0 scale-y-0 invisible"
                }
              `}
              >
                <div className="py-2">
                  {item.submenu.map((subItem, index) => (
                    <a
                      key={index}
                      href={subItem.href}
                      className="block px-4 py-3 text-white hover:bg-[#f3d27a] hover:text-white transition-colors duration-150"
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
  );
};

export { Menu };
