'use client'

import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import type { ISourceOptions } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

type Variant = 'hero' | 'dashboard' | 'minimal'

interface AnimatedBackgroundProps {
  variant?: Variant
  className?: string
}

const VARIANT_CONFIG: Record<
  Variant,
  {
    particleCount: number
    opacity: number
    linkOpacity: number
    speed: number
    linkDistance: number
  }
> = {
  hero: {
    particleCount: 60,
    opacity: 0.6,
    linkOpacity: 0.15,
    speed: 0.4,
    linkDistance: 150,
  },
  dashboard: {
    particleCount: 25,
    opacity: 0.3,
    linkOpacity: 0.08,
    speed: 0.2,
    linkDistance: 120,
  },
  minimal: {
    particleCount: 15,
    opacity: 0.2,
    linkOpacity: 0.05,
    speed: 0.15,
    linkDistance: 100,
  },
}

let engineInitialized = false

export function AnimatedBackground({
  variant = 'hero',
  className,
}: AnimatedBackgroundProps) {
  const config = VARIANT_CONFIG[variant]
  const [ready, setReady] = useState(engineInitialized)

  useEffect(() => {
    if (engineInitialized) {
      setReady(true)
      return
    }
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      engineInitialized = true
      setReady(true)
    })
  }, [])

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: {
          value: config.particleCount,
          density: { enable: true, width: 1920, height: 1080 },
        },
        color: {
          value: ['#8B5CF6', '#06B6D4'],
        },
        opacity: {
          value: { min: config.opacity * 0.4, max: config.opacity },
          animation: {
            enable: true,
            speed: 0.6,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 2.5 },
        },
        move: {
          enable: true,
          speed: config.speed,
          direction: 'none' as const,
          random: true,
          straight: false,
          outModes: { default: 'out' as const },
        },
        links: {
          enable: true,
          distance: config.linkDistance,
          color: '#8B5CF6',
          opacity: config.linkOpacity,
          width: 0.8,
        },
      },
      interactivity: {
        events: {
          onHover: { enable: variant === 'hero', mode: 'grab' },
        },
        modes: {
          grab: {
            distance: 140,
            links: { opacity: 0.2 },
          },
        },
      },
      detectRetina: true,
    }),
    [config, variant],
  )

  if (!ready) return null

  return (
    <Particles
      id={`tsparticles-${variant}`}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ''}`}
      options={options}
    />
  )
}
