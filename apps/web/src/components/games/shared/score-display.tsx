'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface ScoreDisplayProps {
  score: number
  maxScore: number
  className?: string
}

export function ScoreDisplay({ score, maxScore, className }: ScoreDisplayProps) {
  const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const prevScore = useRef(score)

  const springScore = useSpring(prevScore.current, { stiffness: 120, damping: 20 })

  useEffect(() => {
    springScore.set(score)
    prevScore.current = score
  }, [score, springScore])

  const displayScore = useTransform(springScore, (v) => Math.round(v))

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Score counter */}
      <div className="flex items-center gap-1.5">
        <Star className="h-4 w-4 text-amber-400" />
        <span className="font-mono text-sm font-bold text-white">
          <motion.span>{displayScore}</motion.span>
          <span className="text-white/40">/{maxScore}</span>
        </span>
      </div>

      {/* Accuracy bar */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-20 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={cn(
              'h-full rounded-full',
              accuracy >= 80
                ? 'bg-emerald-400'
                : accuracy >= 50
                  ? 'bg-amber-400'
                  : 'bg-red-400',
            )}
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs font-medium text-white/60">{accuracy}%</span>
      </div>
    </div>
  )
}
