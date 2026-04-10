import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()

    // Demo mode: redirect to home if Supabase is not configured
    if (!supabase) {
      return NextResponse.redirect(`${origin}/`)
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user has a role assigned
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role) {
          const rolePaths: Record<string, string> = {
            teacher: '/teacher',
            parent: '/parent',
            admin: '/admin',
          }
          const redirectPath = rolePaths[profile.role] ?? next
          return NextResponse.redirect(`${origin}${redirectPath}`)
        }

        // No role → onboarding
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth error → redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
