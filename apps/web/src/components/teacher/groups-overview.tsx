'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  MOCK_GROUPS,
  MOCK_STUDENTS,
  getArchetypeBadgeVariant,
  ARCHETYPE_COLORS,
} from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users2, Sparkles, FolderOpen, Zap } from 'lucide-react'

function getStudentsForGroup(memberIds: string[]) {
  return memberIds
    .map((id) => MOCK_STUDENTS.find((s) => s.id === id))
    .filter(Boolean)
}

function getSynergyColor(score: number): string {
  if (score >= 85) return 'text-emerald-400'
  if (score >= 70) return 'text-amber-400'
  return 'text-red-400'
}

function getSynergyGlow(score: number): string {
  if (score >= 85)
    return 'border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
  if (score >= 70)
    return 'border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
  return 'border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
}

export function GroupsOverview() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Peer Groups</h2>
          <p className="text-sm text-muted-foreground">
            {MOCK_GROUPS.length} groups · {MOCK_STUDENTS.length} students
            assigned
          </p>
        </div>
        <Button
          className="gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
        >
          <Sparkles className="h-4 w-4" />
          Generate Groups
        </Button>
      </div>

      {/* Group Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {MOCK_GROUPS.map((group) => {
          const members = getStudentsForGroup(group.memberIds)
          const isSelected = selectedGroupId === group.id
          return (
            <Card
              key={group.id}
              className={cn(
                'glass card-glow-hover cursor-pointer transition-all duration-300 hover:scale-[1.01]',
                getSynergyGlow(group.synergyScore),
                isSelected && 'ring-1 ring-purple-500/40'
              )}
              onClick={() =>
                setSelectedGroupId(isSelected ? null : group.id)
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users2 className="h-4 w-4 text-purple-400" />
                    {group.name}
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                    <Zap className={cn('h-4 w-4', getSynergyColor(group.synergyScore))} />
                    <span
                      className={cn(
                        'text-sm font-bold',
                        getSynergyColor(group.synergyScore)
                      )}
                    >
                      {group.synergyScore}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Members */}
                <div className="space-y-2.5">
                  {members.map(
                    (member) =>
                      member && (
                        <div
                          key={member.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                              style={{
                                background: `linear-gradient(135deg, ${ARCHETYPE_COLORS[member.archetype.code]}40, ${ARCHETYPE_COLORS[member.archetype.code]}20)`,
                              }}
                            >
                              {member.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <span className="text-sm text-white">
                              {member.name}
                            </span>
                          </div>
                          <Badge
                            variant={getArchetypeBadgeVariant(
                              member.archetype.code
                            )}
                            className="text-[10px] px-2 py-0"
                          >
                            {member.archetype.name}
                          </Badge>
                        </div>
                      )
                  )}
                </div>

                {/* Project */}
                {group.project && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/5 p-2.5">
                    <FolderOpen className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs text-slate-300">
                      {group.project}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
