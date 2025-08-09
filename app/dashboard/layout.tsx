import type React from 'react'
import { AppSidebar } from './components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ProtectedRoute } from '@/components/Protected/RouteGuard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
