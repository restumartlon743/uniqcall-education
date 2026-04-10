'use client'

import { cn } from '@/lib/utils'
import { ADMIN_STATS } from '@/lib/mock-data'
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
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

const statsCards = [
  {
    label: 'Total Schools',
    value: ADMIN_STATS.totalSchools,
    icon: Building2,
    color: 'purple' as const,
  },
  {
    label: 'Total Teachers',
    value: ADMIN_STATS.totalTeachers,
    icon: GraduationCap,
    color: 'cyan' as const,
  },
  {
    label: 'Total Students',
    value: ADMIN_STATS.totalStudents,
    icon: Users,
    color: 'purple' as const,
  },
  {
    label: 'Total Parents',
    value: ADMIN_STATS.totalParents,
    icon: UserCheck,
    color: 'cyan' as const,
  },
]

const quickActions = [
  {
    label: 'Add School',
    icon: Plus,
    href: '/admin/schools',
    color: 'from-purple-500 to-violet-600',
  },
  {
    label: 'Add Class',
    icon: BookOpen,
    href: '/admin/classes',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    label: 'Import Students',
    icon: Upload,
    href: '/admin/users',
    color: 'from-amber-500 to-orange-600',
  },
]

export function AdminOverview() {
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
              className={cn(
                'glass group relative overflow-hidden rounded-xl p-5 transition-all hover:scale-[1.02]',
                isCyan
                  ? 'border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                  : 'border-purple-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl',
                    isCyan
                      ? 'bg-cyan-500/15 text-cyan-400'
                      : 'bg-purple-500/15 text-purple-400'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div
                className={cn(
                  'absolute bottom-0 left-0 h-0.5 w-full',
                  isCyan
                    ? 'bg-linear-to-r from-transparent via-cyan-500 to-transparent'
                    : 'bg-linear-to-r from-transparent via-purple-500 to-transparent'
                )}
              />
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.label} href={action.href}>
                  <div className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-purple-500/30 hover:bg-white/10">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br',
                        action.color
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">
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
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Database</p>
                <p className="text-xs text-emerald-400">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Auth Service</p>
                <p className="text-xs text-emerald-400">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Realtime</p>
                <p className="text-xs text-emerald-400">Operational</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
