'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  Brain,
  Gamepad2,
  Bell,
  Info,
  Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function ToggleSwitch({
  enabled,
  onToggle,
  label,
}: {
  enabled: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        onClick={onToggle}
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          enabled ? 'bg-purple-500' : 'bg-slate-600'
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            enabled && 'translate-x-4'
          )}
        />
      </button>
    </div>
  )
}

export function AdminSettings() {
  const [config, setConfig] = useState({
    cognitiveModuleEnabled: true,
    varkModuleEnabled: true,
    interestModuleEnabled: true,
    gamificationEnabled: true,
    xpMultiplier: 1.0,
    badgesEnabled: true,
  })
  const [xpMultiplier, setXpMultiplier] = useState(
    String(config.xpMultiplier)
  )

  function toggle(key: keyof typeof config) {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Assessment Configuration */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
            <Brain className="h-4 w-4 text-purple-400" />
            Assessment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-white/[0.06]">
            <ToggleSwitch
              enabled={config.cognitiveModuleEnabled}
              onToggle={() => toggle('cognitiveModuleEnabled')}
              label="Cognitive Assessment Module"
            />
            <ToggleSwitch
              enabled={config.varkModuleEnabled}
              onToggle={() => toggle('varkModuleEnabled')}
              label="VARK Learning Style Module"
            />
            <ToggleSwitch
              enabled={config.interestModuleEnabled}
              onToggle={() => toggle('interestModuleEnabled')}
              label="Interest Profiling Module"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gamification Settings */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
            <Gamepad2 className="h-4 w-4 text-cyan-400" />
            Gamification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-white/[0.06]">
            <ToggleSwitch
              enabled={config.gamificationEnabled}
              onToggle={() => toggle('gamificationEnabled')}
              label="Enable Gamification"
            />
            <ToggleSwitch
              enabled={config.badgesEnabled}
              onToggle={() => toggle('badgesEnabled')}
              label="Enable Badges"
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="xp-multiplier" className="text-xs text-slate-400">
              XP Multiplier
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="xp-multiplier"
                type="number"
                step="0.1"
                min="0.1"
                max="5.0"
                value={xpMultiplier}
                onChange={(e) => setXpMultiplier(e.target.value)}
                className="w-28"
              />
              <span className="text-xs text-slate-500">
                Default: 1.0 / Range: 0.1 - 5.0
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Notifications */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
            <Bell className="h-4 w-4 text-amber-400" />
            System Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-lg border-l-2 border-l-cyan-500 border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">
                      System Update Available
                    </p>
                    <Badge className="border-cyan-500/30 bg-cyan-500/15 text-cyan-300">
                      New
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Version 2.1.0 is available. Review changelog before updating.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border-l-2 border-l-slate-500 border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    Scheduled Maintenance
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    April 15, 2026 -- 02:00-04:00 WIB. Platform may be temporarily
                    unavailable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Info */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
            <Settings className="h-4 w-4 text-slate-400" />
            Platform Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-xs text-slate-500">Version</p>
              <p className="mt-0.5 text-sm text-slate-200">2.0.0</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Environment</p>
              <p className="mt-0.5 text-sm text-slate-200">Production</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Database</p>
              <p className="mt-0.5 text-sm text-slate-200">
                Supabase PostgreSQL
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Deployment</p>
              <p className="mt-0.5 text-sm text-slate-200">April 8, 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-1.5">
          <Save className="h-4 w-4" data-icon="inline-start" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
