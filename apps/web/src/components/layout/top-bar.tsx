'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Bell, LogOut, Search, User } from 'lucide-react'
import { useState } from 'react'

interface TopBarProps {
  title: string
  userName?: string
  avatarUrl?: string
}

export function TopBar({ title, userName, avatarUrl }: TopBarProps) {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0A0E27]/60 px-6 backdrop-blur-md">
      {/* Page Title */}
      <h1 className="font-heading text-xl font-semibold text-white">
        {title}
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 md:flex">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-44 bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-400" />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-white/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-cyan-500 text-xs font-bold text-white">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName ?? 'User'}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                (userName?.[0] ?? 'U').toUpperCase()
              )}
            </div>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-white/10 bg-[#151B3B] p-1 shadow-xl">
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <User className="h-4 w-4" />
                  Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
