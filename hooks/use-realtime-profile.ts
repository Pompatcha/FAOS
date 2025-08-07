'use client'

import { useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { Profile } from '@/actions/auth'
import { AuthDebug } from '@/utils/auth-debug'

export function useRealtimeProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }
        return
      }

      setProfile(data)
      AuthDebug.profile(data)
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, supabase])

  useEffect(() => {
    if (!user?.id) {
      setProfile(null)
      return
    }

    fetchProfile()

    const channel = supabase
      .channel(`profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          AuthDebug.log('Profile updated in real-time', payload.eventType)

          if (
            payload.eventType === 'UPDATE' ||
            payload.eventType === 'INSERT'
          ) {
            const newProfile = payload.new as Profile
            setProfile(newProfile)
          } else if (payload.eventType === 'DELETE') {
            setProfile(null)
            AuthDebug.log('Profile deleted')
          }
        },
      )
      .subscribe((status) => {
        console.log('Profile subscription status:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, fetchProfile, supabase])

  return { profile, loading, refetch: fetchProfile }
}
