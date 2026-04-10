import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.redirect(`${origin}/login?error=config_missing`)
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Ensure profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!profile) {
          // Create profile for new user
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: user.user_metadata?.full_name ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null,
          })
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        if (profile.role) {
          const rolePaths: Record<string, string> = {
            teacher: '/teacher',
            parent: '/parent',
            admin: '/admin',
            student: '/student',
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
