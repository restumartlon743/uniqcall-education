'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
type AvatarView = 'front' | 'three-quarter' | 'side'
type AvatarGender = 'male' | 'female'

interface ArchetypeAvatarProps {
  archetypeCode: string
  gender?: AvatarGender
  view?: AvatarView
  size?: AvatarSize
  className?: string
  glowColor?: string
  showPlatform?: boolean
}

const SIZE_CONFIG: Record<AvatarSize, { width: number; height: number }> = {
  sm: { width: 60, height: 80 },
  md: { width: 100, height: 140 },
  lg: { width: 140, height: 190 },
  xl: { width: 200, height: 280 },
}

function getAvatarSrc(code: string, gender: AvatarGender, view: AvatarView): string {
  const normalizedCode = code.toLowerCase()
  if (view === 'front') {
    return `/avatars/${normalizedCode}-${gender}.png`
  }
  return `/avatars/${normalizedCode}-${gender}-${view}.png`
}

export function ArchetypeAvatar({
  archetypeCode,
  gender = 'male',
  view = 'front',
  size = 'md',
  className,
  glowColor = '#8B5CF6',
  showPlatform = false,
}: ArchetypeAvatarProps) {
  const config = SIZE_CONFIG[size]

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {/* Glow behind avatar */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-2xl opacity-30"
        style={{ backgroundColor: glowColor }}
      />

      {/* Avatar image */}
      <div
        className="relative overflow-hidden"
        style={{ width: config.width, height: config.height }}
      >
        <Image
          src={getAvatarSrc(archetypeCode, gender, view)}
          alt={`${archetypeCode} ${gender} avatar`}
          fill
          sizes={`${config.width}px`}
          className="object-contain object-top drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          priority={size === 'lg' || size === 'xl'}
        />
      </div>

      {/* Holographic platform */}
      {showPlatform && (
        <div className="relative -mt-1">
          <div
            className="h-2 rounded-full opacity-60"
            style={{
              width: config.width * 0.7,
              background: `radial-gradient(ellipse, ${glowColor}60, transparent 70%)`,
              boxShadow: `0 0 15px ${glowColor}40`,
            }}
          />
        </div>
      )}
    </div>
  )
}
