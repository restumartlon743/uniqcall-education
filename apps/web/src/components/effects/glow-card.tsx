'use client'

import type { ReactNode } from 'react'

type GlowColor = 'purple' | 'cyan' | 'gold' | 'pink'

interface GlowCardProps {
  children: ReactNode
  glowColor?: GlowColor
  hoverEffect?: boolean
  className?: string
}

const GLOW_STYLES: Record<GlowColor, { border: string; hoverShadow: string; hoverBorder: string; shimmerGradient: string }> = {
  purple: {
    border: 'border-purple-500/10',
    hoverShadow: 'hover:shadow-[0_0_25px_rgba(139,92,246,0.3),0_0_50px_rgba(139,92,246,0.1)]',
    hoverBorder: 'hover:border-purple-500/40',
    shimmerGradient: 'from-transparent via-purple-500/10 to-transparent',
  },
  cyan: {
    border: 'border-cyan-500/10',
    hoverShadow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.3),0_0_50px_rgba(6,182,212,0.1)]',
    hoverBorder: 'hover:border-cyan-500/40',
    shimmerGradient: 'from-transparent via-cyan-500/10 to-transparent',
  },
  gold: {
    border: 'border-amber-500/10',
    hoverShadow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.3),0_0_50px_rgba(245,158,11,0.1)]',
    hoverBorder: 'hover:border-amber-500/40',
    shimmerGradient: 'from-transparent via-amber-500/10 to-transparent',
  },
  pink: {
    border: 'border-pink-500/10',
    hoverShadow: 'hover:shadow-[0_0_25px_rgba(236,72,153,0.3),0_0_50px_rgba(236,72,153,0.1)]',
    hoverBorder: 'hover:border-pink-500/40',
    shimmerGradient: 'from-transparent via-pink-500/10 to-transparent',
  },
}

export function GlowCard({ children, glowColor = 'purple', hoverEffect = true, className }: GlowCardProps) {
  const styles = GLOW_STYLES[glowColor]

  return (
    <div
      className={[
        'group relative overflow-hidden rounded-xl border bg-white/5 backdrop-blur-xl',
        'transition-all duration-300 ease-out',
        styles.border,
        hoverEffect && styles.hoverShadow,
        hoverEffect && styles.hoverBorder,
        hoverEffect && 'hover:-translate-y-0.5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}

      {/* Shimmer sweep on hover */}
      {hoverEffect && (
        <div
          className={`pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r ${styles.shimmerGradient} opacity-0 transition-opacity duration-300 group-hover:animate-shimmer group-hover:opacity-100`}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
