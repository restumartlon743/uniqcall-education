'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface XpEvent {
  id: number
  amount: number
}

interface XpPopupProps {
  xp: number
  className?: string
}

let popupId = 0

export function XpPopup({ xp, className }: XpPopupProps) {
  const [events, setEvents] = useState<XpEvent[]>([])
  const [lastXp, setLastXp] = useState(0)

  useEffect(() => {
    if (xp > lastXp && lastXp > 0) {
      const diff = xp - lastXp
      const id = ++popupId
      setEvents((prev) => [...prev, { id, amount: diff }])

      // Remove after animation
      setTimeout(() => {
        setEvents((prev) => prev.filter((e) => e.id !== id))
      }, 1500)
    }
    setLastXp(xp)
  }, [xp, lastXp])

  return (
    <div className={cn('pointer-events-none relative', className)}>
      <AnimatePresence>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -60, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="text-lg font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">
              +{event.amount} XP
            </span>

            {/* Particle bursts */}
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  x: (Math.random() - 0.5) * 60,
                  y: (Math.random() - 0.5) * 40 - 20,
                  scale: 0,
                }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-amber-400"
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
