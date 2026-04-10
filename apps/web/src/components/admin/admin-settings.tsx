'use client'

import { useState } from 'react'
import { MOCK_SYSTEM_CONFIG, type MockSystemConfig } from '@/lib/mock-data'
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
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
      <span className="text-sm font-medium text-white">{label}</span>
      <button
        onClick={onToggle}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          enabled ? 'bg-purple-500' : 'bg-slate-600'
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
            enabled && 'translate-x-5'
          )}
        />
      </button>
    </div>
  )
}

export function AdminSettings() {
  const [config, setConfig] = useState<MockSystemConfig>(MOCK_SYSTEM_CONFIG)
  const [xpMultiplier, setXpMultiplier] = useState(
    String(config.xpMultiplier)
  )

  function toggle(key: keyof MockSystemConfig) {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Assessment Configuration */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Assessment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
        </CardContent>
      </Card>

      {/* Gamification Settings */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-cyan-400" />
            Gamification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="xp-multiplier">XP Multiplier</Label>
            <div className="flex items-center gap-3">
              <Input
                id="xp-multiplier"
                type="number"
                step="0.1"
                min="0.1"
                max="5.0"
                value={xpMultiplier}
                onChange={(e) => setXpMultiplier(e.target.value)}
                className="w-32"
              />
              <span className="text-xs text-slate-400">
                Default: 1.0 &middot; Range: 0.1 – 5.0
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Notifications */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-400" />
            System Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  System Update Available
                </p>
                <p className="text-xs text-slate-400">
                  Version 2.1.0 is available. Review changelog before updating.
                </p>
              </div>
              <Badge className="ml-auto border-cyan-500/30 bg-cyan-500/15 text-cyan-300">
                New
              </Badge>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  Scheduled Maintenance
                </p>
                <p className="text-xs text-slate-400">
                  April 15, 2026 — 02:00-04:00 WIB. Platform may be temporarily
                  unavailable.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Info */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-400" />
            Platform Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Version</p>
              <p className="text-sm font-medium text-white">2.0.0</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Environment</p>
              <p className="text-sm font-medium text-white">Production</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Database</p>
              <p className="text-sm font-medium text-white">
                Supabase PostgreSQL
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Last Deployment</p>
              <p className="text-sm font-medium text-white">April 8, 2026</p>
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
