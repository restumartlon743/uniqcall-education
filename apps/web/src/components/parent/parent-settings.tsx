'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  useCurrentUser,
  useParentChildren,
} from '@/hooks/use-supabase-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  User,
  Mail,
  Bell,
  BellOff,
  Link2,
  Shield,
  Check,
  Users,
} from 'lucide-react'

interface NotificationPref {
  key: string
  label: string
  description: string
  enabled: boolean
}

const defaultPrefs: NotificationPref[] = [
  { key: 'weekly_report', label: 'Weekly Report', description: 'Receive weekly progress summary', enabled: true },
  { key: 'badge_unlocked', label: 'Badge Unlocked', description: 'When your child earns a new badge', enabled: true },
  { key: 'teacher_message', label: 'Teacher Messages', description: 'New messages from teachers', enabled: true },
  { key: 'attention_alert', label: 'Attention Alerts', description: 'When your child needs attention', enabled: true },
  { key: 'quest_completed', label: 'Quest Completed', description: 'When your child completes a quest', enabled: false },
  { key: 'daily_summary', label: 'Daily Summary', description: 'Daily activity digest', enabled: false },
]

export function ParentSettings() {
  const { user, profile, loading: userLoading } = useCurrentUser()
  const { children, loading: childrenLoading } = useParentChildren(user?.id ?? '')
  const [prefs, setPrefs] = useState(defaultPrefs)
  const [inviteCode, setInviteCode] = useState('')
  const [linkSuccess, setLinkSuccess] = useState(false)

  const isLoading = userLoading || childrenLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  function togglePref(key: string) {
    setPrefs((prev) =>
      prev.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p))
    )
  }

  function handleLinkChild() {
    if (!inviteCode.trim()) return
    // In production, this would validate via Supabase
    setLinkSuccess(true)
    setInviteCode('')
    setTimeout(() => setLinkSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text font-heading text-3xl font-bold text-transparent">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Profile */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-400" />
              Personal Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/15 ring-2 ring-purple-500/30">
                <User className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{profile?.full_name || 'Parent'}</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {user?.email || 'No email'}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Signed in via Google OAuth</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Linked Children */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-cyan-400" />
              Linked Children
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current children */}
            {children.length > 0 ? (
              children.map((child) => (
                <div key={child.id} className="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/15">
                    <User className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{child.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {child.className} {child.school ? `\u2022 ${child.school}` : ''}
                    </p>
                  </div>
                  <Badge variant={child.archetype.code.toLowerCase() as never}>
                    {child.archetype.name}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Users className="h-8 w-8 mb-2 text-slate-600" />
                <p className="text-sm text-slate-400">No children linked yet</p>
              </div>
            )}

            {/* Link new child */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-300">Link New Child</p>
              <p className="text-xs text-muted-foreground">
                Enter the invite code from your child&apos;s school
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter invite code..."
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLinkChild()
                  }}
                />
                <button
                  onClick={handleLinkChild}
                  disabled={!inviteCode.trim()}
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-cyan-500 px-4 text-sm font-medium text-white transition-all hover:bg-cyan-600 disabled:opacity-50"
                >
                  <Link2 className="h-4 w-4" />
                  Link
                </button>
              </div>
              {linkSuccess && (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <Check className="h-4 w-4" />
                  Child linked successfully!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-400" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {prefs.map((pref) => (
                <button
                  key={pref.key}
                  onClick={() => togglePref(pref.key)}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                    pref.enabled
                      ? 'border-purple-500/30 bg-purple-500/5'
                      : 'border-white/10 bg-white/5 opacity-60'
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      pref.enabled
                        ? 'bg-purple-500/15 text-purple-400'
                        : 'bg-white/5 text-slate-500'
                    )}
                  >
                    {pref.enabled ? (
                      <Bell className="h-4 w-4" />
                    ) : (
                      <BellOff className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{pref.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{pref.description}</p>
                  </div>
                  <div
                    className={cn(
                      'ml-auto mt-1 h-5 w-9 shrink-0 rounded-full border transition-all',
                      pref.enabled
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-white/20 bg-white/10'
                    )}
                  >
                    <div
                      className={cn(
                        'h-4 w-4 rounded-full bg-white transition-all',
                        pref.enabled ? 'translate-x-4' : 'translate-x-0.5'
                      )}
                    />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
