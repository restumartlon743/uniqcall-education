import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import dynamic from 'next/dynamic'

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

  // Demo mode: render with mock user when Supabase is not configured
  if (!supabase) {
    return (
      <>
        <AnimatedBackground variant="dashboard" />
        <DashboardShell
          role="teacher"
          userName="Demo User"
          userEmail="demo@uniqcall.edu"
          avatarUrl={undefined}
        >
          {children}
        </DashboardShell>
      </>
    )
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

  if (!profile?.role) {
    redirect('/onboarding')
  }

  return (
    <>
      <AnimatedBackground variant="dashboard" />
      <DashboardShell
        role={profile.role}
        userName={profile.full_name ?? user.user_metadata?.full_name ?? 'User'}
        userEmail={user.email ?? ''}
        avatarUrl={profile.avatar_url ?? user.user_metadata?.avatar_url}
      >
        {children}
      </DashboardShell>
    </>
  )
}
