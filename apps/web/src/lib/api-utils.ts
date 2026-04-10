import type { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { UserRole } from '@uniqcall/shared/types'

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function requireAuth(supabase: Awaited<ReturnType<typeof createClient>>) {
  if (!supabase) {
    return { user: null, error: apiError('Supabase not configured — running in demo mode', 503) }
  }
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return { user: null, error: apiError('Unauthorized', 401) }
  }
  return { user, error: null }
}

export async function requireRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  role: UserRole
) {
  if (!supabase) {
    return { user: null, profile: null, error: apiError('Supabase not configured — running in demo mode', 503) }
  }
  const { user, error } = await requireAuth(supabase)
  if (error) return { user: null, profile: null, error }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  if (profileError || !profile) {
    return { user: null, profile: null, error: apiError('Profile not found', 404) }
  }

  if (profile.role !== role) {
    return { user: null, profile: null, error: apiError('Forbidden', 403) }
  }

  return { user: user!, profile, error: null }
}
