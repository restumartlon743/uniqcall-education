'use client'

import Link from 'next/link'
import Image from 'next/image'
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
        'hidden md:flex h-screen flex-col border-r border-white/[0.06] bg-[#0A0E27] transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo + Toggle */}
      <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
        {!collapsed && (
          <Link href={basePath} className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-cyan-500">
              <span className="text-xs font-bold text-white">U</span>
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-sm font-semibold text-transparent">
              Uniqcall
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-cyan-500">
            <span className="text-xs font-bold text-white">U</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'rounded-md p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300',
            collapsed && 'hidden'
          )}
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="flex h-10 items-center justify-center border-b border-white/[0.06] text-slate-500 transition-colors hover:text-slate-300"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-white/[0.06] text-white'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-purple-500" />
              )}
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
        <div className="border-t border-white/[0.06] px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-xs font-bold text-white">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={userName ?? 'User'}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                (userName?.[0] ?? 'U').toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-slate-200">
                {userName ?? 'User'}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {userEmail ?? ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
