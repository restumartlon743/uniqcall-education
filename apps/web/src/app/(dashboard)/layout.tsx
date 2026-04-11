import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import dynamic from 'next/dynamic'

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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createAdminClient(url, key, { auth: { persistSession: false } })
}

const AnimatedBackground = dynamic(
  () => import('@/components/effects/animated-background').then((m) => m.AnimatedBackground),
  { ssr: false }
)

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  if (!supabase) {
    redirect('/login')
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  let resolvedProfile = profile
  let role = normalizeRole(resolvedProfile?.role)

  if (!role) {
    const adminClient = getAdminClient()
    if (adminClient) {
      const { data: adminProfile } = await adminClient
        .from('profiles')
        .select('role, full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      if (adminProfile) {
        resolvedProfile = adminProfile
        role = normalizeRole(adminProfile.role)
      }
    }
  }

  if (!role) {
    redirect('/onboarding')
  }

  return (
    <>
      <AnimatedBackground variant="dashboard" />
      <DashboardShell
        role={role}
        userName={resolvedProfile?.full_name ?? user.user_metadata?.full_name ?? 'User'}
        userEmail={user.email ?? ''}
        avatarUrl={resolvedProfile?.avatar_url ?? user.user_metadata?.avatar_url}
      >
        {children}
      </DashboardShell>
    </>
  )
}
