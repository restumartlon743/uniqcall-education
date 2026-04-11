'use client'

import { Sidebar, type NavItem } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { usePathname } from 'next/navigation'
import { useMemo, type ReactNode } from 'react'
import {
  BarChart3,
  Clipboard,
  LayoutDashboard,
  Settings,
  Users,
  Users2,
  Home,
  TrendingUp,
  MessageCircle,
  Building2,
  BookOpen,
  Map,
  User,
  Trophy,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

interface NavItemDef {
  labelKey: string
  href: string
  icon: ReactNode
}

const teacherNavDefs: NavItemDef[] = [
  { labelKey: 'dashboard.overview', href: '/teacher', icon: <LayoutDashboard className="h-5 w-5" /> },
  { labelKey: 'dashboard.students', href: '/teacher/students', icon: <Users className="h-5 w-5" /> },
  { labelKey: 'dashboard.classes', href: '/teacher/classes', icon: <BookOpen className="h-5 w-5" /> },
  { labelKey: 'dashboard.groups', href: '/teacher/groups', icon: <Users2 className="h-5 w-5" /> },
  { labelKey: 'dashboard.tasks', href: '/teacher/tasks', icon: <Clipboard className="h-5 w-5" /> },
  { labelKey: 'dashboard.reports', href: '/teacher/reports', icon: <BarChart3 className="h-5 w-5" /> },
  { labelKey: 'dashboard.settings', href: '/teacher/settings', icon: <Settings className="h-5 w-5" /> },
]

const parentNavDefs: NavItemDef[] = [
  { labelKey: 'dashboard.overview', href: '/parent', icon: <Home className="h-5 w-5" /> },
  { labelKey: 'parent.growth', href: '/parent/growth', icon: <TrendingUp className="h-5 w-5" /> },
  { labelKey: 'dashboard.messages', href: '/parent/messages', icon: <MessageCircle className="h-5 w-5" /> },
  { labelKey: 'dashboard.settings', href: '/parent/settings', icon: <Settings className="h-5 w-5" /> },
]

const adminNavDefs: NavItemDef[] = [
  { labelKey: 'dashboard.overview', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { labelKey: 'admin.schools', href: '/admin/schools', icon: <Building2 className="h-5 w-5" /> },
  { labelKey: 'admin.classes', href: '/admin/classes', icon: <BookOpen className="h-5 w-5" /> },
  { labelKey: 'admin.users', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { labelKey: 'dashboard.settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
]

const studentNavDefs: NavItemDef[] = [
  { labelKey: 'dashboard.overview', href: '/student', icon: <LayoutDashboard className="h-5 w-5" /> },
  { labelKey: 'student.leaderboard', href: '/student/leaderboard', icon: <Trophy className="h-5 w-5" /> },
  { labelKey: 'student.quests', href: '/student/quests', icon: <Map className="h-5 w-5" /> },
  { labelKey: 'student.learn', href: '/student/learn', icon: <BookOpen className="h-5 w-5" /> },
  { labelKey: 'student.groups', href: '/student/groups', icon: <Users className="h-5 w-5" /> },
  { labelKey: 'student.profile', href: '/student/profile', icon: <User className="h-5 w-5" /> },
]

const navDefsMap: Record<string, NavItemDef[]> = {
  teacher: teacherNavDefs,
  parent: parentNavDefs,
  admin: adminNavDefs,
  student: studentNavDefs,
}

const basePathMap: Record<string, string> = {
  teacher: '/teacher',
  parent: '/parent',
  admin: '/admin',
  student: '/student',
}

interface DashboardShellProps {
  role: string
  userName: string
  userEmail: string
  avatarUrl?: string
  children: ReactNode
}

export function DashboardShell({
  role,
  userName,
  userEmail,
  avatarUrl,
  children,
}: DashboardShellProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const effectiveRole = pathname.startsWith('/student')
    ? 'student'
    : pathname.startsWith('/parent')
      ? 'parent'
      : pathname.startsWith('/admin')
        ? 'admin'
        : role

  const navDefs = navDefsMap[effectiveRole] ?? teacherNavDefs
  const navItems: NavItem[] = useMemo(
    () => navDefs.map((def) => ({ label: t(def.labelKey), href: def.href, icon: def.icon })),
    [navDefs, t],
  )
  const basePath = basePathMap[effectiveRole] ?? '/teacher'

  function getPageTitle(path: string): string {
    const segments = path.split('/').filter(Boolean)
    if (segments.length <= 1) return t('dashboard.overview')
    const last = segments[segments.length - 1]
    const key = `dashboard.${last}`
    const translated = t(key)
    return translated !== key ? translated : last.charAt(0).toUpperCase() + last.slice(1)
  }

  return (
    <div className="flex h-screen bg-[#0A0E27]">
      <Sidebar
        navItems={navItems}
        basePath={basePath}
        userName={userName}
        userEmail={userEmail}
        avatarUrl={avatarUrl}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          title={getPageTitle(pathname)}
          userName={userName}
          avatarUrl={avatarUrl}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
