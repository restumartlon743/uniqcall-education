'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface CursorGlowProps {
  enabled?: boolean
}

interface TrailParticle {
  el: HTMLDivElement
  x: number
  y: number
}

export function CursorGlow({ enabled = true }: CursorGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const trailsRef = useRef<TrailParticle[]>([])
  const quickXRef = useRef<gsap.QuickToFunc | null>(null)
  const quickYRef = useRef<gsap.QuickToFunc | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const glow = glowRef.current
    if (!glow) return

    quickXRef.current = gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power2.out' })
    quickYRef.current = gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power2.out' })

    // Create trail particles
    const container = containerRef.current
    if (!container) return

    const trails: TrailParticle[] = []
    for (let i = 0; i < 4; i++) {
      const el = document.createElement('div')
      el.className = 'absolute rounded-full pointer-events-none'
      const size = 4 - i
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.background = i % 2 === 0
        ? 'rgba(139, 92, 246, 0.6)'
        : 'rgba(6, 182, 212, 0.6)'
      el.style.willChange = 'transform'
      container.appendChild(el)
      trails.push({ el, x: 0, y: 0 })
    }
    trailsRef.current = trails

    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true)

      const x = e.clientX - 100 // center the 200px glow
      const y = e.clientY - 100

      quickXRef.current?.(x)
      quickYRef.current?.(y)

      // Animate trail particles with staggered delay
      trails.forEach((trail, i) => {
        gsap.to(trail.el, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3 + i * 0.12,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    }

    const handleMouseLeave = () => {
      setVisible(false)
    }

    const handleMouseEnter = () => {
      setVisible(true)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      trails.forEach((t) => t.el.remove())
    }
  }, [enabled, visible])

  if (!enabled) return null

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={glowRef}
        className="absolute h-[200px] w-[200px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
