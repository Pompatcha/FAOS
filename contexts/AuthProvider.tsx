'use client'
import { useEffect } from 'react'

import type { ReactNode } from 'react'

import useAuthStore from '@/store/authStore'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)
  const initialized = useAuthStore((state) => state.initialized)

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialize, initialized])

  return children
}
