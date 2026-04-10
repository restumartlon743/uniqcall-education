'use client'

import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarPlaceholderProps {
  size?: AvatarSize
  archetypeColor?: string
  archetype?: string
  className?: string
}

const SIZE_CONFIG: Record<AvatarSize, { width: number; height: number; badgeText: string; strokeWidth: number }> = {
  sm: { width: 120, height: 160, badgeText: 'text-[8px]', strokeWidth: 1.5 },
  md: { width: 180, height: 240, badgeText: 'text-[10px]', strokeWidth: 2 },
  lg: { width: 260, height: 347, badgeText: 'text-xs', strokeWidth: 2.5 },
}

export function AvatarPlaceholder({
  size = 'md',
  archetypeColor = '#8B5CF6',
  archetype,
  className,
}: AvatarPlaceholderProps) {
  const config = SIZE_CONFIG[size]
  const vw = 260
  const vh = 347

  return (
    <div
      className={cn('relative', className)}
      style={{ width: config.width, height: config.height }}
    >
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        width={config.width}
        height={config.height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Glow filter for the figure outline */}
          <filter id="avatar-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow filter for the platform */}
          <filter id="platform-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for the figure */}
          <linearGradient id="figure-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
            <stop offset="100%" stopColor={archetypeColor} stopOpacity="0.9" />
          </linearGradient>

          {/* Radial gradient for platform surface */}
          <radialGradient id="platform-surface" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
            <stop offset="70%" stopColor={archetypeColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={archetypeColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Platform ── */}
        <g filter="url(#platform-glow)">
          <ellipse
            cx={vw / 2}
            cy={310}
            rx={90}
            ry={20}
            fill="url(#platform-surface)"
            stroke="#06B6D4"
            strokeWidth={1.5}
            strokeOpacity={0.6}
            className="animate-[platform-pulse_3s_ease-in-out_infinite]"
          />
          {/* Inner ring */}
          <ellipse
            cx={vw / 2}
            cy={310}
            rx={60}
            ry={13}
            fill="none"
            stroke="#06B6D4"
            strokeWidth={0.8}
            strokeOpacity={0.3}
            strokeDasharray="4 3"
          />
        </g>

        {/* ── Figure Group (floating animation via CSS) ── */}
        <g
          filter="url(#avatar-glow)"
          className="animate-[avatar-float_4s_ease-in-out_infinite]"
          style={{ transformOrigin: `${vw / 2}px 200px` }}
        >
          {/* Legs */}
          {/* Left leg */}
          <path
            d={`M${vw / 2 - 16} 230 L${vw / 2 - 20} 280 L${vw / 2 - 26} 298 L${vw / 2 - 14} 298 L${vw / 2 - 10} 280 L${vw / 2 - 6} 230 Z`}
            fill={`${archetypeColor}15`}
            stroke="url(#figure-gradient)"
            strokeWidth={config.strokeWidth}
            strokeLinejoin="round"
          />
          {/* Right leg */}
          <path
            d={`M${vw / 2 + 6} 230 L${vw / 2 + 10} 280 L${vw / 2 + 14} 298 L${vw / 2 + 26} 298 L${vw / 2 + 20} 280 L${vw / 2 + 16} 230 Z`}
            fill={`${archetypeColor}15`}
            stroke="url(#figure-gradient)"
            strokeWidth={config.strokeWidth}
            strokeLinejoin="round"
          />

          {/* Torso — armored plate shape */}
          <path
            d={`M${vw / 2 - 28} 140 
               L${vw / 2 - 32} 160 
               L${vw / 2 - 26} 230 
               L${vw / 2 + 26} 230 
               L${vw / 2 + 32} 160 
               L${vw / 2 + 28} 140 Z`}
            fill={`${archetypeColor}12`}
            stroke="url(#figure-gradient)"
            strokeWidth={config.strokeWidth}
            strokeLinejoin="round"
          />
          {/* Torso center line detail */}
          <line
            x1={vw / 2}
            y1={148}
            x2={vw / 2}
            y2={222}
            stroke={archetypeColor}
            strokeWidth={0.8}
            strokeOpacity={0.3}
          />
          {/* Chest plate accent */}
          <path
            d={`M${vw / 2 - 14} 155 L${vw / 2} 165 L${vw / 2 + 14} 155`}
            fill="none"
            stroke="#06B6D4"
            strokeWidth={1}
            strokeOpacity={0.5}
          />

          {/* Left arm */}
          <path
            d={`M${vw / 2 - 32} 148 L${vw / 2 - 48} 180 L${vw / 2 - 44} 220 L${vw / 2 - 36} 218 L${vw / 2 - 40} 182 L${vw / 2 - 28} 155`}
            fill={`${archetypeColor}10`}
            stroke="url(#figure-gradient)"
            strokeWidth={config.strokeWidth}
            strokeLinejoin="round"
          />
          {/* Right arm */}
          <path
            d={`M${vw / 2 + 32} 148 L${vw / 2 + 48} 180 L${vw / 2 + 44} 220 L${vw / 2 + 36} 218 L${vw / 2 + 40} 182 L${vw / 2 + 28} 155`}
            fill={`${archetypeColor}10`}
            stroke="url(#figure-gradient)"
            strokeWidth={config.strokeWidth}
            strokeLinejoin="round"
          />

          {/* Shoulder pads */}
          <ellipse
            cx={vw / 2 - 34}
            cy={146}
            rx={10}
            ry={6}
            fill={`${archetypeColor}20`}
            stroke="url(#figure-gradient)"
            strokeWidth={config.strokeWidth * 0.8}
          />
          <ellipse
            cx={vw / 2 + 34}
            cy={146}
            rx={10}
            ry={6}
            fill={`${archetypeColor}20`}
            stroke="url(#figure-gradient)"
            strokeWidth={config.strokeWidth * 0.8}
          />

          {/* Neck */}
          <rect
            x={vw / 2 - 6}
            y={118}
            width={12}
            height={22}
            rx={4}
            fill={`${archetypeColor}10`}
            stroke="url(#figure-gradient)"
            strokeWidth={config.strokeWidth * 0.8}
          />

          {/* Head */}
          <circle
            cx={vw / 2}
            cy={95}
            r={28}
            fill={`${archetypeColor}10`}
            stroke="url(#figure-gradient)"
            strokeWidth={config.strokeWidth}
          />
          {/* Visor / eye line */}
          <path
            d={`M${vw / 2 - 18} 92 Q${vw / 2} 88 ${vw / 2 + 18} 92`}
            fill="none"
            stroke="#06B6D4"
            strokeWidth={2.5}
            strokeOpacity={0.8}
            strokeLinecap="round"
          />
          {/* Visor glow dots */}
          <circle cx={vw / 2 - 8} cy={91} r={2} fill="#06B6D4" opacity={0.9} />
          <circle cx={vw / 2 + 8} cy={91} r={2} fill="#06B6D4" opacity={0.9} />

          {/* Helmet crest / top detail */}
          <path
            d={`M${vw / 2} 67 L${vw / 2 - 4} 74 L${vw / 2 + 4} 74 Z`}
            fill={archetypeColor}
            fillOpacity={0.4}
            stroke={archetypeColor}
            strokeWidth={1}
            strokeOpacity={0.6}
          />
        </g>

        {/* ── Holographic scan lines ── */}
        <g opacity={0.08}>
          {Array.from({ length: 8 }, (_, i) => (
            <line
              key={i}
              x1={vw / 2 - 50}
              y1={100 + i * 28}
              x2={vw / 2 + 50}
              y2={100 + i * 28}
              stroke="#06B6D4"
              strokeWidth={0.5}
            />
          ))}
        </g>
      </svg>

      {/* ── Archetype Badge (floating top-right) ── */}
      {archetype && (
        <div
          className={cn(
            'absolute right-0 top-4 animate-[avatar-float_3s_ease-in-out_infinite_0.5s] rounded-lg border px-2 py-1 backdrop-blur-md',
            config.badgeText,
          )}
          style={{
            borderColor: `${archetypeColor}60`,
            backgroundColor: `${archetypeColor}20`,
            color: archetypeColor,
            boxShadow: `0 0 12px ${archetypeColor}30`,
          }}
        >
          <span className="font-semibold">{archetype}</span>
        </div>
      )}

      {/* ── Keyframe styles ── */}
      <style jsx>{`
        @keyframes avatar-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes platform-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
