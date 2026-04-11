import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

type UserRole = 'teacher' | 'parent' | 'admin' | 'student'

const ROLE_PATHS: Record<UserRole, string> = {
  teacher: '/teacher',
  parent: '/parent',
  admin: '/admin',
  student: '/student',
}

function normalizeRole(role: unknown): UserRole | null {
  if (typeof role !== 'string') return null
  const normalized = role.trim().toLowerCase()
  if (normalized in ROLE_PATHS) {
    return normalized as UserRole
  }
  return null
}

function getAdminClient() {
  // Service role client — bypasses RLS, only used server-side
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createAdminClient(url, key, { auth: { persistSession: false } })
}

function getOrigin(request: NextRequest): string {
  // Use explicit site URL env var if set (avoids 0.0.0.0 on Render)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  // Reconstruct from forwarded headers (reverse proxy / Render)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }
  // Fallback to request URL origin (works on localhost)
  return new URL(request.url).origin
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const origin = getOrigin(request)
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
        // Use service role client to bypass RLS for profile read/write
        const adminClient = getAdminClient() ?? supabase

        // Ensure profile exists
        const { data: profile } = await adminClient
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const normalizedRole = normalizeRole(profile?.role)

        if (!profile) {
          // Create profile for new user
          await adminClient.from('profiles').insert({
            id: user.id,
            full_name: user.user_metadata?.full_name ?? user.email ?? 'User',
            avatar_url: user.user_metadata?.avatar_url ?? null,
          })
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        if (normalizedRole) {
          const redirectPath = ROLE_PATHS[normalizedRole]
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
