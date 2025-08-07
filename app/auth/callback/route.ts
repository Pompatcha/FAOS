import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

interface ProfileData {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface ProfileUpdateData {
  updated_at: string
  full_name?: string
  avatar_url?: string
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error) {
    console.error('OAuth Error:', error, error_description)
    return NextResponse.redirect(
      `${origin}/?error=${encodeURIComponent(error_description || error)}`,
    )
  }

  if (code) {
    const supabase = await createClient()

    try {
      const { data, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(
          `${origin}/?error=${encodeURIComponent(exchangeError.message)}`,
        )
      }

      if (data.user) {
        await ensureUserProfile(supabase, data.user)
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error('Unexpected error during OAuth callback:', err)
      return NextResponse.redirect(`${origin}/?error=authentication_failed`)
    }
  }

  return NextResponse.redirect(`${origin}/?error=invalid_callback`)
}

async function ensureUserProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<void> {
  try {
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (!existingProfile) {
      const profileData: ProfileData = {
        id: user.id,
        email: user.email || '',
        full_name:
          user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert(profileData)

      if (insertError) {
        console.error('Error creating profile:', insertError)
        throw insertError
      }
    } else {
      const updateData: ProfileUpdateData = {
        updated_at: new Date().toISOString(),
      }

      if (user.user_metadata?.full_name || user.user_metadata?.name) {
        updateData.full_name =
          user.user_metadata?.full_name || user.user_metadata?.name
      }

      if (user.user_metadata?.avatar_url || user.user_metadata?.picture) {
        updateData.avatar_url =
          user.user_metadata?.avatar_url || user.user_metadata?.picture
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
      }
    }
  } catch (error) {
    console.error('Error in ensureUserProfile:', error)
  }
}
