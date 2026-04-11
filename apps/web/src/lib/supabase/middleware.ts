import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createAdminClient(url, key, { auth: { persistSession: false } })
}

export async function updateSession(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes that don't need auth
  const publicRoutes = ['/', '/login', '/auth/callback']
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith('/auth/')
  )

  // If not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If authenticated, check for role-based routing
  if (user && !isPublicRoute && pathname !== '/onboarding') {
    const db = getAdminClient() ?? supabase
    const { data: profile } = await db
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // No profile or no role → onboarding
    if (!profile?.role) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    // Redirect role mismatches (e.g., teacher accessing /parent)
    const rolePaths: Record<string, string> = {
      teacher: '/teacher',
      parent: '/parent',
      admin: '/admin',
      student: '/student',
    }

    const expectedPrefix = rolePaths[profile.role]
    if (expectedPrefix) {
      const dashboardPrefixes = ['/teacher', '/parent', '/admin', '/student']
      const isOnDashboard = dashboardPrefixes.some((p) =>
        pathname.startsWith(p)
      )

      if (isOnDashboard && !pathname.startsWith(expectedPrefix)) {
        const url = request.nextUrl.clone()
        url.pathname = expectedPrefix
        return NextResponse.redirect(url)
      }
    }
  }

  // If authenticated and on login page, redirect to dashboard
  if (user && (pathname === '/login' || pathname === '/')) {
    const db = getAdminClient() ?? supabase
    const { data: profile } = await db
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role) {
      const rolePaths: Record<string, string> = {
        teacher: '/teacher',
        parent: '/parent',
        admin: '/admin',
        student: '/student',
      }
      const url = request.nextUrl.clone()
      url.pathname = rolePaths[profile.role] ?? '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
