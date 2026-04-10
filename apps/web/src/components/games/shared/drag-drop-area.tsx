'use client'

import type { ReactNode, DragEvent } from 'react'
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── DragItem ─────────────────────────────────────────────────

interface DragItemProps {
  id: string
  children: ReactNode
  data?: string
  className?: string
  onDragStart?: (id: string) => void
  onDragEnd?: (id: string) => void
}

export function DragItem({ id, children, data, className, onDragStart, onDragEnd }: DragItemProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData('text/plain', data ?? id)
      e.dataTransfer.effectAllowed = 'move'
      setIsDragging(true)
      onDragStart?.(id)
    },
    [id, data, onDragStart],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    onDragEnd?.(id)
  }, [id, onDragEnd])

  return (
    <motion.div
      draggable
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onDragStart={handleDragStart as any}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.05 }}
      animate={{ scale: isDragging ? 1.08 : 1, opacity: isDragging ? 0.7 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'cursor-grab active:cursor-grabbing select-none',
        'rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm',
        'transition-shadow hover:shadow-[0_0_12px_rgba(139,92,246,0.2)]',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

// ─── DropZone ─────────────────────────────────────────────────

interface DropZoneProps {
  id: string
  children?: ReactNode
  onDrop: (zoneId: string, data: string) => void
  accept?: string
  className?: string
  activeClassName?: string
  placeholder?: string
}

export function DropZone({
  id,
  children,
  onDrop,
  className,
  activeClassName,
  placeholder = 'Drop here',
}: DropZoneProps) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsOver(false)
      const data = e.dataTransfer.getData('text/plain')
      onDrop(id, data)
    },
    [id, onDrop],
  )

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={{
        scale: isOver ? 1.02 : 1,
        borderColor: isOver ? 'rgba(139, 92, 246, 0.6)' : 'rgba(255, 255, 255, 0.1)',
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-lg border-2 border-dashed border-white/10 p-4',
        'flex min-h-20 items-center justify-center',
        'transition-colors',
        isOver && 'bg-purple-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]',
        isOver && activeClassName,
        className,
      )}
    >
      {children ?? <span className="text-sm text-white/30">{placeholder}</span>}
    </motion.div>
  )
}
