'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Profile } from '@/app/actions/auth'

interface ExtendedProfile extends Profile {
  role?: string
  permissions?: string[]
}

interface RouteGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireGuest?: boolean
  redirectTo?: string
  fallback?: ReactNode
  roles?: string[]
  permissions?: string[]
}

export function RouteGuard({
  children,
  requireAuth = false,
  requireGuest = false,
  redirectTo,
  fallback,
  roles = [],
  permissions = [],
}: RouteGuardProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    if (requireGuest && user) {
      const redirect = redirectTo || '/dashboard'
      router.push(redirect)
      return
    }

    if (requireAuth && !user) {
      const redirect =
        redirectTo || `/auth?redirectTo=${encodeURIComponent(pathname)}`
      router.push(redirect)
      return
    }

    if (requireAuth && user && roles.length > 0) {
      const userRole = (profile as ExtendedProfile)?.role || 'user'
      if (!roles.includes(userRole)) {
        router.push('/unauthorized')
        return
      }
    }

    if (requireAuth && user && permissions.length > 0) {
      const userPermissions = (profile as ExtendedProfile)?.permissions || []
      const hasPermission = permissions.some((permission) =>
        userPermissions.includes(permission),
      )
      if (!hasPermission) {
        router.push('/unauthorized')
        return
      }
    }
  }, [
    user,
    profile,
    loading,
    requireAuth,
    requireGuest,
    redirectTo,
    roles,
    permissions,
    router,
    pathname,
  ])

  if (loading) {
    return (
      fallback || (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='flex flex-col items-center space-y-4'>
            <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (requireGuest && user) {
    return null
  }

  if (requireAuth && !user) {
    return null
  }

  if (requireAuth && user && roles.length > 0) {
    const userRole = (profile as ExtendedProfile)?.role || 'user'
    if (!roles.includes(userRole)) {
      return null
    }
  }

  if (requireAuth && user && permissions.length > 0) {
    const userPermissions = (profile as ExtendedProfile)?.permissions || []
    const hasPermission = permissions.some((permission) =>
      userPermissions.includes(permission),
    )
    if (!hasPermission) {
      return null
    }
  }

  return <>{children}</>
}

export function ProtectedRoute({
  children,
  redirectTo = '/',
  fallback,
  roles,
  permissions,
}: Omit<RouteGuardProps, 'requireAuth'>) {
  return (
    <RouteGuard
      requireAuth
      redirectTo={redirectTo}
      fallback={fallback}
      roles={roles}
      permissions={permissions}
    >
      {children}
    </RouteGuard>
  )
}

export function GuestRoute({
  children,
  redirectTo = '/',
  fallback,
}: Omit<RouteGuardProps, 'requireGuest'>) {
  return (
    <RouteGuard requireGuest redirectTo={redirectTo} fallback={fallback}>
      {children}
    </RouteGuard>
  )
}

export function AdminRoute({
  children,
  redirectTo = '/',
  fallback,
}: Omit<RouteGuardProps, 'requireAuth' | 'roles'>) {
  return (
    <RouteGuard
      requireAuth
      roles={['admin']}
      redirectTo={redirectTo}
      fallback={fallback}
    >
      {children}
    </RouteGuard>
  )
}

export function CustomerRoute({
  children,
  redirectTo = '/',
  fallback,
}: Omit<RouteGuardProps, 'requireAuth' | 'roles'>) {
  return (
    <RouteGuard
      requireAuth
      roles={['customer']}
      redirectTo={redirectTo}
      fallback={fallback}
    >
      {children}
    </RouteGuard>
  )
}

export function ShowIfAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null
  return user ? <>{children}</> : null
}

export function ShowIfGuest({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null
  return !user ? <>{children}</> : null
}

export function ShowIfAdmin({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) return null
  if (!user) return null

  const userRole = (profile as ExtendedProfile)?.role
  return userRole === 'admin' ? <>{children}</> : null
}

export function ShowIfCustomer({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) return null
  if (!user) return null

  const userRole = (profile as ExtendedProfile)?.role
  return userRole === 'customer' ? <>{children}</> : null
}

export function ShowIfRole({
  children,
  roles,
}: {
  children: ReactNode
  roles: string[]
}) {
  const { user, profile, loading } = useAuth()

  if (loading) return null
  if (!user) return null

  const userRole = (profile as ExtendedProfile)?.role || 'user'
  return roles.includes(userRole) ? <>{children}</> : null
}
