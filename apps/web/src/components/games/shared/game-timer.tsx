'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/game-utils'

interface GameTimerProps {
  /** Total seconds for countdown; omit for countup */
  timeLimit?: number
  /** Whether timer is running */
  isRunning: boolean
  /** Called when countdown reaches 0 */
  onTimeUp?: () => void
  /** Current elapsed seconds (controlled externally) */
  elapsed: number
  className?: string
}

export function GameTimer({ timeLimit, isRunning, onTimeUp, elapsed, className }: GameTimerProps) {
  const isCountdown = timeLimit !== undefined
  const remaining = isCountdown ? Math.max(timeLimit - elapsed, 0) : elapsed
  const displayTime = formatTime(remaining)

  const isLow = isCountdown && remaining <= 10 && remaining > 0
  const isUrgent = isCountdown && remaining <= 5 && remaining > 0

  // Progress fraction for the circular indicator (countdown only)
  const progress = isCountdown && timeLimit > 0 ? remaining / timeLimit : 1

  useEffect(() => {
    if (isCountdown && remaining === 0 && isRunning) {
      onTimeUp?.()
    }
  }, [remaining, isCountdown, isRunning, onTimeUp])

  // SVG circle parameters
  const size = 64
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      {/* Circular progress ring */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-white/10"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={cn(
              'transition-all duration-1000 ease-linear',
              isUrgent ? 'stroke-red-500' : isLow ? 'stroke-amber-400' : 'stroke-cyan-400',
            )}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>

        {/* Time text in center */}
        <span
          className={cn(
            'absolute text-sm font-mono font-bold',
            isUrgent ? 'text-red-400 animate-pulse' : isLow ? 'text-amber-400' : 'text-white',
          )}
        >
          {displayTime}
        </span>
      </div>

      {/* Neon glow when low */}
      {isLow && (
        <div
          className={cn(
            'absolute inset-0 rounded-full pointer-events-none',
            isUrgent
              ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]'
              : 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
          )}
        />
      )}
    </div>
  )
}
