import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

import { createUserRecord } from '@/actions/auth'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription || error)}`,
    )
  }

  if (!code) {
    console.error('No authorization code provided')
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const supabase = await createClient()

    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`,
      )
    }

    if (data.user) {
      const { user } = data

      await createUserRecord(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        await supabase.auth.updateUser({
          data: {
            profile: profile,
          },
        })
      }
    }

    return NextResponse.redirect(`${origin}${next}`)
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(`${origin}/login?error=unexpected_error`)
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
