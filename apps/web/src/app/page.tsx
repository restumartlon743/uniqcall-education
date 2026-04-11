'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, BookOpen, Compass, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { GlowCard } from '@/components/effects/glow-card'
import { useLanguage } from '@/lib/i18n/context'
import { LanguageToggle } from '@/components/ui/language-toggle'

const AnimatedBackground = dynamic(
  () => import('@/components/effects/animated-background').then((m) => m.AnimatedBackground),
  { ssr: false }
)

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const FEATURE_KEYS = [
  {
    titleKey: 'landing.feature_cognitive_title',
    descKey: 'landing.feature_cognitive_desc',
    icon: Brain,
    glow: 'purple' as const,
  },
  {
    titleKey: 'landing.feature_vark_title',
    descKey: 'landing.feature_vark_desc',
    icon: BookOpen,
    glow: 'cyan' as const,
  },
  {
    titleKey: 'landing.feature_navigator_title',
    descKey: 'landing.feature_navigator_desc',
    icon: Compass,
    glow: 'gold' as const,
  },
]

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#0A0E27]">
      <AnimatedBackground variant="hero" />

      {/* Language Toggle */}
      <div className="fixed right-6 top-6 z-50">
        <LanguageToggle />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-24 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-slate-400 backdrop-blur-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>
          {t('landing.badge_text')}
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          className="font-heading text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-r from-purple-400 via-white to-cyan-400 bg-clip-text text-transparent">
            Uniqcall
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
            Education
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-lg font-light tracking-wide text-slate-300 sm:text-xl"
        >
          {t('landing.hero_subtitle')}
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="mt-3 max-w-lg text-sm leading-relaxed text-slate-500"
        >
          {t('landing.hero_description')}
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp} className="mt-10">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            }}
          >
            {t('landing.cta_button')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Decorative divider */}
        <motion.div variants={fadeUp} className="mt-20 flex w-full items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="h-1.5 w-1.5 rounded-full bg-purple-500/40" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {FEATURE_KEYS.map((feature) => (
            <motion.div key={feature.titleKey} variants={fadeUp}>
              <GlowCard glowColor={feature.glow} hoverEffect className="p-6">
                <feature.icon
                  className={`mb-4 h-7 w-7 ${
                    feature.glow === 'purple'
                      ? 'text-purple-400'
                      : feature.glow === 'cyan'
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                  }`}
                />
                <h3 className="text-sm font-semibold text-white">
                  {t(feature.titleKey)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {t(feature.descKey)}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Footer */}
      <div className="relative z-10 w-full pb-8 pt-4 text-center">
        <p className="text-xs tracking-widest text-slate-600">
          {t('common.powered_by')}
        </p>
      </div>
    </div>
  )
}
