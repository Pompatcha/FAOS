import { Home, Package, Receipt } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'

const items = [
  {
    title: 'หน้าหลัก',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'จัดการสินค้า',
    url: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'จัดการออเดอร์',
    url: '/dashboard/orders',
    icon: Receipt,
  },
]

export function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className='px-3 py-2'>
              <h2 className='text-lg font-semibold'>FAOS Co.,Ltd.</h2>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
