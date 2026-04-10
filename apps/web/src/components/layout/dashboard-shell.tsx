'use client'

import { Sidebar, type NavItem } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'
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
} from 'lucide-react'

const teacherNav: NavItem[] = [
  {
    label: 'Overview',
    href: '/teacher',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Students',
    href: '/teacher/students',
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Groups',
    href: '/teacher/groups',
    icon: <Users2 className="h-5 w-5" />,
  },
  {
    label: 'Tasks',
    href: '/teacher/tasks',
    icon: <Clipboard className="h-5 w-5" />,
  },
  {
    label: 'Reports',
    href: '/teacher/reports',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: 'Settings',
    href: '/teacher/settings',
    icon: <Settings className="h-5 w-5" />,
  },
]

const parentNav: NavItem[] = [
  {
    label: 'Overview',
    href: '/parent',
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: 'Growth',
    href: '/parent/growth',
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: 'Messages',
    href: '/parent/messages',
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    label: 'Settings',
    href: '/parent/settings',
    icon: <Settings className="h-5 w-5" />,
  },
]

const adminNav: NavItem[] = [
  {
    label: 'Overview',
    href: '/admin',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Schools',
    href: '/admin/schools',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    label: 'Classes',
    href: '/admin/classes',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />,
  },
]

const studentNav: NavItem[] = [
  {
    label: 'Overview',
    href: '/student',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Quests',
    href: '/student/quests',
    icon: <Map className="h-5 w-5" />,
  },
  {
    label: 'Learn',
    href: '/student/learn',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    label: 'Groups',
    href: '/student/groups',
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Profile',
    href: '/student/profile',
    icon: <User className="h-5 w-5" />,
  },
]

const navMap: Record<string, NavItem[]> = {
  teacher: teacherNav,
  parent: parentNav,
  admin: adminNav,
  student: studentNav,
}

const basePathMap: Record<string, string> = {
  teacher: '/teacher',
  parent: '/parent',
  admin: '/admin',
  student: '/student',
}

function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length <= 1) return 'Overview'
  const last = segments[segments.length - 1]
  return last.charAt(0).toUpperCase() + last.slice(1)
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
  // Auto-detect role from pathname (enables demo mode across all dashboards)
  const effectiveRole = pathname.startsWith('/student')
    ? 'student'
    : pathname.startsWith('/parent')
      ? 'parent'
      : pathname.startsWith('/admin')
        ? 'admin'
        : role
  const navItems = navMap[effectiveRole] ?? teacherNav
  const basePath = basePathMap[effectiveRole] ?? '/teacher'

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
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
