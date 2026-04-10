'use client'

import { useEffect, useRef, useCallback } from 'react'

type Variant = 'hero' | 'dashboard' | 'minimal'

interface AnimatedBackgroundProps {
  variant?: Variant
  className?: string
}

interface Particle {
  x: number
  y: number
  size: number
  color: string
  opacity: number
  vx: number
  vy: number
  twinkleSpeed: number
  twinklePhase: number
}

interface CircuitNode {
  x: number
  y: number
  connections: number[]
  pulsePhase: number
  pulseSpeed: number
}

interface Nebula {
  x: number
  y: number
  radius: number
  color: string
  opacity: number
  vx: number
  vy: number
  pulsePhase: number
  pulseSpeed: number
}

const COLORS = ['#8B5CF6', '#06B6D4', '#FFFFFF']

const VARIANT_CONFIG: Record<Variant, { particleCount: number; opacity: number; showCircuit: boolean; showNebula: boolean }> = {
  hero: { particleCount: 90, opacity: 1, showCircuit: true, showNebula: true },
  dashboard: { particleCount: 50, opacity: 0.3, showCircuit: true, showNebula: false },
  minimal: { particleCount: 40, opacity: 0.5, showCircuit: false, showNebula: false },
}

function createParticles(count: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 1 + Math.random() * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: 0.2 + Math.random() * 0.6,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    twinkleSpeed: 0.5 + Math.random() * 2,
    twinklePhase: Math.random() * Math.PI * 2,
  }))
}

function createCircuitNodes(width: number, height: number): CircuitNode[] {
  const nodes: CircuitNode[] = []
  const spacing = 120
  const cols = Math.ceil(width / spacing)
  const rows = Math.ceil(height / spacing)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c
      const connections: number[] = []
      if (c < cols - 1) connections.push(idx + 1)
      if (r < rows - 1) connections.push(idx + cols)
      if (c < cols - 1 && r < rows - 1 && Math.random() > 0.7) connections.push(idx + cols + 1)

      nodes.push({
        x: c * spacing + spacing / 2 + (Math.random() - 0.5) * 30,
        y: r * spacing + spacing / 2 + (Math.random() - 0.5) * 30,
        connections,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.3 + Math.random() * 0.7,
      })
    }
  }
  return nodes
}

function createNebulae(width: number, height: number): Nebula[] {
  const nebulaColors = ['rgba(139,92,246,', 'rgba(6,182,212,', 'rgba(236,72,153,']
  return Array.from({ length: 4 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 150 + Math.random() * 250,
    color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
    opacity: 0.03 + Math.random() * 0.04,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.2 + Math.random() * 0.3,
  }))
}

export function AnimatedBackground({ variant = 'hero', className }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const circuitNodesRef = useRef<CircuitNode[]>([])
  const nebulaeRef = useRef<Nebula[]>([])

  const config = VARIANT_CONFIG[variant]

  const initEntities = useCallback((width: number, height: number) => {
    particlesRef.current = createParticles(config.particleCount, width, height)
    if (config.showCircuit) {
      circuitNodesRef.current = createCircuitNodes(width, height)
    }
    if (config.showNebula) {
      nebulaeRef.current = createNebulae(width, height)
    }
  }, [config])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    const setSize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    setSize()
    initEntities(width, height)

    const handleResize = () => {
      setSize()
      initEntities(width, height)
    }

    window.addEventListener('resize', handleResize)

    let time = 0

    const draw = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)
      ctx.globalAlpha = config.opacity

      // Nebulae
      if (config.showNebula) {
        for (const nebula of nebulaeRef.current) {
          nebula.x += nebula.vx
          nebula.y += nebula.vy
          if (nebula.x < -nebula.radius) nebula.x = width + nebula.radius
          if (nebula.x > width + nebula.radius) nebula.x = -nebula.radius
          if (nebula.y < -nebula.radius) nebula.y = height + nebula.radius
          if (nebula.y > height + nebula.radius) nebula.y = -nebula.radius

          const pulse = Math.sin(time * nebula.pulseSpeed + nebula.pulsePhase) * 0.3 + 0.7
          const gradient = ctx.createRadialGradient(
            nebula.x, nebula.y, 0,
            nebula.x, nebula.y, nebula.radius * pulse
          )
          gradient.addColorStop(0, `${nebula.color}${(nebula.opacity * 1.5).toFixed(3)})`)
          gradient.addColorStop(0.5, `${nebula.color}${(nebula.opacity * 0.5).toFixed(3)})`)
          gradient.addColorStop(1, `${nebula.color}0)`)
          ctx.fillStyle = gradient
          ctx.fillRect(
            nebula.x - nebula.radius, nebula.y - nebula.radius,
            nebula.radius * 2, nebula.radius * 2
          )
        }
      }

      // Circuit grid
      if (config.showCircuit) {
        const nodes = circuitNodesRef.current
        for (const node of nodes) {
          const nodePulse = Math.sin(time * node.pulseSpeed + node.pulsePhase) * 0.5 + 0.5

          // Draw connections
          for (const connIdx of node.connections) {
            const target = nodes[connIdx]
            if (!target) continue
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.03 + nodePulse * 0.06})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }

          // Draw node dot
          ctx.beginPath()
          ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(139, 92, 246, ${0.1 + nodePulse * 0.2})`
          ctx.fill()
        }
      }

      // Particles
      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7
        const alpha = p.opacity * twinkle

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color === '#FFFFFF'
          ? `rgba(255, 255, 255, ${alpha})`
          : p.color === '#8B5CF6'
            ? `rgba(139, 92, 246, ${alpha})`
            : `rgba(6, 182, 212, ${alpha})`
        ctx.fill()

        // Small glow around larger particles
        if (p.size > 2) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
          glow.addColorStop(0, p.color === '#FFFFFF'
            ? `rgba(255, 255, 255, ${alpha * 0.3})`
            : p.color === '#8B5CF6'
              ? `rgba(139, 92, 246, ${alpha * 0.3})`
              : `rgba(6, 182, 212, ${alpha * 0.3})`)
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
          ctx.fillStyle = glow
          ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8)
        }
      }

      ctx.globalAlpha = 1
      animFrameRef.current = requestAnimationFrame(draw)
    }

    animFrameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [config, initEntities])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ''}`}
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  )
}
