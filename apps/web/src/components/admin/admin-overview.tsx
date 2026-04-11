'use client'

import { cn } from '@/lib/utils'
import { useAdminStats } from '@/hooks/use-supabase-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  Plus,
  BookOpen,
  Upload,
  Activity,
  Circle,
} from 'lucide-react'
import Link from 'next/link'

const quickActions = [
  {
    label: 'Add School',
    icon: Plus,
    href: '/admin/schools',
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    label: 'Add Class',
    icon: BookOpen,
    href: '/admin/classes',
    iconColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    label: 'Import Students',
    icon: Upload,
    href: '/admin/users',
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
]

const systemServices = [
  { label: 'Database', status: 'Operational' },
  { label: 'Auth Service', status: 'Operational' },
  { label: 'Realtime', status: 'Operational' },
]

export function AdminOverview() {
  const { stats, loading } = useAdminStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const statsCards = [
    { label: 'Total Schools', value: stats.totalSchools, icon: Building2, color: 'purple' as const },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: GraduationCap, color: 'cyan' as const },
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'purple' as const },
    { label: 'Total Parents', value: stats.totalParents, icon: UserCheck, color: 'cyan' as const },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          const isCyan = stat.color === 'cyan'
          return (
            <div
              key={stat.label}
              className="glass rounded-xl p-5 transition-colors hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    isCyan
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'bg-purple-500/10 text-purple-400'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-400">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.label} href={action.href}>
                  <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg',
                        action.bgColor
                      )}
                    >
                      <Icon className={cn('h-4 w-4', action.iconColor)} />
                    </div>
                    <span className="text-sm font-medium text-slate-200">
                      {action.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
            <Activity className="h-4 w-4 text-cyan-400" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemServices.map((service) => (
              <div
                key={service.label}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <span className="text-sm text-slate-300">{service.label}</span>
                <div className="flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
