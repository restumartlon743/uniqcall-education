'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MOCK_TASKS } from '@/lib/mock-data'
import type { MockTask } from '@/lib/mock-data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CreateTaskDialog } from '@/components/teacher/create-task-dialog'
import {
  Plus,
  Calendar,
  Users,
  User,
  Zap,
  FileText,
  Clock,
} from 'lucide-react'

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date('2026-04-10') // Current date
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getDueBadge(dateStr: string) {
  const days = getDaysUntil(dateStr)
  if (days < 0) return { label: 'Overdue', className: 'bg-red-500/15 text-red-300 border-red-500/30' }
  if (days === 0) return { label: 'Due today', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30' }
  if (days === 1) return { label: 'Due tomorrow', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30' }
  return { label: `${days} days left`, className: 'bg-white/10 text-slate-300 border-white/20' }
}

export function TaskManager() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Task Management</h2>
          <p className="text-sm text-muted-foreground">
            {MOCK_TASKS.filter((t) => t.status === 'active').length} active
            tasks · {MOCK_TASKS.length} total
          </p>
        </div>
        <Button
          className="gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create New Task
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {MOCK_TASKS.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <CreateTaskDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

function TaskCard({ task }: { task: MockTask }) {
  const dueBadge = getDueBadge(task.dueDate)
  const submissionPercent = Math.round(
    (task.submissionsCount / task.totalExpected) * 100
  )

  return (
    <Card className="glass card-glow-hover border-purple-500/20 transition-all duration-300 hover:border-purple-500/40">
      <CardContent className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Info */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-purple-400" />
              <h3 className="truncate font-semibold text-white">
                {task.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {task.description}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {/* Type badge */}
              <Badge
                variant="outline"
                className="gap-1"
              >
                {task.type === 'group' ? (
                  <Users className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {task.type === 'group' ? 'Group' : 'Individual'}
              </Badge>

              {/* Target Archetype */}
              {task.targetArchetype && (
                <Badge variant="default" className="text-[10px]">
                  {task.targetArchetype}
                </Badge>
              )}

              {/* Due date */}
              <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium', dueBadge.className)}>
                <Calendar className="h-3 w-3" />
                {dueBadge.label}
              </span>

              {/* XP */}
              <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                <Zap className="h-3 w-3" />
                {task.xpReward} XP
              </span>
            </div>
          </div>

          {/* Right: Submission Progress */}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-white font-medium">
                {task.submissionsCount}
              </span>
              <span className="text-muted-foreground">
                / {task.totalExpected}
              </span>
            </div>
            <Progress
              value={submissionPercent}
              className="w-24"
            />
            <span className="text-[10px] text-muted-foreground">
              {submissionPercent}% submitted
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
