'use client'

import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Bell, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import { LanguageToggle } from '@/components/ui/language-toggle'

interface TopBarProps {
  title: string
  userName?: string
  avatarUrl?: string
}

export function TopBar({ title, userName, avatarUrl }: TopBarProps) {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { t } = useLanguage()

  async function handleLogout() {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/login')
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#0A0E27] px-6">
      {/* Page Title */}
      <h1 className="text-sm font-semibold text-white">
        {title}
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative rounded-md p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </button>

        {/* Language Toggle */}
        <LanguageToggle />

        {/* Separator */}
        <div className="mx-1 h-5 w-px bg-white/[0.06]" />

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-white/5"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-[10px] font-bold text-white">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={userName ?? 'User'}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
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
              <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-lg border border-white/[0.08] bg-[#151B3B] p-1 shadow-xl">
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <User className="h-3.5 w-3.5" />
                  {t('settings.profile')}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t('common.sign_out')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
