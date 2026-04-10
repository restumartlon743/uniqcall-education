'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, BookOpen, Compass } from 'lucide-react'
import dynamic from 'next/dynamic'
import { GlowCard } from '@/components/effects/glow-card'
import { ArchetypeAvatar } from '@/components/effects/archetype-avatar'

const AnimatedBackground = dynamic(
  () => import('@/components/effects/animated-background').then((m) => m.AnimatedBackground),
  { ssr: false }
)

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
}

const FEATURES = [
  {
    title: 'Cognitive Assessment',
    desc: '7 parameter kognitif',
    icon: Brain,
    glow: 'purple' as const,
  },
  {
    title: 'VARK Profiling',
    desc: 'Gaya belajar personal',
    icon: BookOpen,
    glow: 'cyan' as const,
  },
  {
    title: 'Knowledge Navigator',
    desc: '12 arketipe unik',
    icon: Compass,
    glow: 'gold' as const,
  },
]

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#0A0E27]">
      <AnimatedBackground variant="hero" />

      {/* Hero Section */}
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium tracking-wide text-slate-400 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          Sistem Navigasi Masa Depan Siswa
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          className="font-heading text-7xl font-bold leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl"
        >
          <span
            className="bg-linear-to-r from-purple-400 via-white to-cyan-400 bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 80px rgba(139,92,246,0.5), 0 0 160px rgba(6,182,212,0.3)',
              filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.4)) drop-shadow(0 0 60px rgba(6,182,212,0.2))',
            }}
          >
            Uniqcall
          </span>
          <br />
          <span
            className="bg-linear-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(6,182,212,0.4)) drop-shadow(0 0 60px rgba(139,92,246,0.2))',
            }}
          >
            Education
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-xl font-light tracking-wide text-slate-300 sm:text-2xl"
        >
          Empowering Every Unique Mind.
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="mt-3 max-w-md text-sm leading-relaxed text-slate-500"
        >
          Platform edukasi personal berbasis AI untuk memahami potensi unik setiap siswa melalui asesmen kognitif dan profiling gaya belajar.
        </motion.p>

        {/* Avatar Platform Stage */}
        <motion.div variants={scaleIn} className="relative mt-14 w-full max-w-2xl">
          {/* Platform glow */}
          <div className="absolute -inset-4 rounded-3xl bg-cyan-500/5 blur-2xl" />
          <div className="absolute -inset-2 rounded-2xl bg-linear-to-r from-cyan-500/10 via-purple-500/5 to-cyan-500/10 blur-xl" />

          {/* Platform body */}
          <div
            className="relative rounded-2xl border border-cyan-500/20 bg-[#0D1230]/80 px-8 py-10 backdrop-blur-sm"
            style={{
              boxShadow: '0 0 40px rgba(6,182,212,0.1), inset 0 1px 0 rgba(6,182,212,0.1)',
              backgroundImage:
                'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* 3 Avatar Spots */}
            <div className="flex items-end justify-center gap-4 sm:gap-10 md:gap-16">
              {[
                { code: 'THINKER', gender: 'male' as const, label: 'Thinker', glow: '#8B5CF6', badgeClass: 'border-purple-500/30 bg-purple-500/10 text-purple-400', ringClass: 'bg-purple-500/30', baseClass: 'bg-purple-500/40', baseShadow: '0 0 15px rgba(139,92,246,0.4)' },
                { code: 'EXPLORER', gender: 'female' as const, label: 'Explorer', glow: '#06B6D4', badgeClass: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400', ringClass: 'bg-cyan-500/30', baseClass: 'bg-cyan-500/40', baseShadow: '0 0 15px rgba(6,182,212,0.4)' },
                { code: 'CREATOR', gender: 'female' as const, label: 'Creator', glow: '#F59E0B', badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400', ringClass: 'bg-amber-500/30', baseClass: 'bg-amber-500/40', baseShadow: '0 0 15px rgba(245,158,11,0.4)' },
              ].map((avatar, i) => (
                <div key={avatar.code} className="flex flex-col items-center gap-2 sm:gap-3">
                  {/* Floating badge above avatar */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                    className={`rounded-lg border px-2 py-1 text-[10px] font-medium backdrop-blur-sm ${avatar.badgeClass}`}
                  >
                    {avatar.label}
                  </motion.div>

                  {/* Avatar image */}
                  <ArchetypeAvatar
                    archetypeCode={avatar.code}
                    gender={avatar.gender}
                    size="sm"
                    glowColor={avatar.glow}
                    showPlatform={false}
                    className="sm:scale-125 md:scale-150 origin-bottom transition-transform"
                  />

                  {/* Glowing base ring */}
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      className={`absolute -inset-1 rounded-full ${avatar.ringClass}`}
                    />
                    <div
                      className={`h-3 w-12 rounded-full sm:w-16 ${avatar.baseClass}`}
                      style={{ boxShadow: avatar.baseShadow }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button inside platform */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/login"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-10 py-4 text-sm font-bold tracking-wide text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                  boxShadow:
                    '0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                {/* Pulse ring */}
                <span className="absolute inset-0 animate-pulse rounded-xl bg-linear-to-r from-purple-500/20 to-cyan-500/20" />
                <span className="relative z-10">Enter Your Dashboard</span>
                <svg
                  className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Platform bottom glow line */}
          <div className="mx-auto mt-1 h-px w-3/4 bg-linear-to-r from-transparent via-cyan-500/40 to-transparent" />
          <div className="mx-auto mt-0.5 h-px w-1/2 bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          className="mt-24 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={fadeUp}>
              <GlowCard glowColor={feature.glow} hoverEffect className="p-6">
                <feature.icon
                  className={`mb-3 h-8 w-8 ${
                    feature.glow === 'purple'
                      ? 'text-purple-400'
                      : feature.glow === 'cyan'
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                  }`}
                  style={{
                    filter:
                      feature.glow === 'purple'
                        ? 'drop-shadow(0 0 8px rgba(139,92,246,0.5))'
                        : feature.glow === 'cyan'
                          ? 'drop-shadow(0 0 8px rgba(6,182,212,0.5))'
                          : 'drop-shadow(0 0 8px rgba(245,158,11,0.5))',
                  }}
                />
                <h3 className="font-heading text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {feature.desc}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="relative z-10 w-full pb-8 pt-4 text-center">
        <p className="text-xs tracking-widest text-slate-600">
          Powered by Uniqcall Education
        </p>
      </div>
    </div>
  )
}
