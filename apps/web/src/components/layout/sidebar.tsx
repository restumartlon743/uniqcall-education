'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PanelLeftClose, PanelLeft } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

interface SidebarProps {
  navItems: NavItem[]
  basePath: string
  userName?: string
  userEmail?: string
  avatarUrl?: string
}

export function Sidebar({
  navItems,
  basePath,
  userName,
  userEmail,
  avatarUrl,
}: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'hidden md:flex h-screen flex-col border-r border-white/10 bg-[#0A0E27]/80 backdrop-blur-xl transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href={basePath} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-cyan-500">
              <span className="text-sm font-bold text-white">U</span>
            </div>
            <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text font-heading text-lg font-bold text-transparent">
              Uniqcall
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-cyan-500">
            <span className="text-sm font-bold text-white">U</span>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-10 items-center justify-center border-b border-white/5 text-slate-400 transition-colors hover:text-white"
      >
        {collapsed ? (
          <PanelLeft className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-purple-500/15 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <span
                className={cn(
                  'shrink-0',
                  isActive ? 'text-purple-400' : 'text-slate-500'
                )}
              >
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      {!collapsed && (
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-cyan-500 text-xs font-bold text-white">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName ?? 'User'}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                (userName?.[0] ?? 'U').toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {userName ?? 'User'}
              </p>
              <p className="truncate text-xs text-slate-500">
                {userEmail ?? ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
