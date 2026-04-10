'use client'

import { motion } from 'framer-motion'
import { Chrome } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AnimatedBackground } from '@/components/effects/animated-background'
import { CursorGlow } from '@/components/effects/cursor-glow'
import { useLanguage } from '@/lib/i18n/context'
import { LanguageToggle } from '@/components/ui/language-toggle'

function handleGoogleSignIn() {
  const supabase = createClient()
  if (!supabase) return
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function LoginPage() {
  const { t } = useLanguage()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0E27]">
      <AnimatedBackground variant="hero" />
      <CursorGlow />

      {/* Language Toggle */}
      <div className="absolute right-4 top-4 z-20">
        <LanguageToggle />
      </div>

      {/* Login Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Gradient border glow */}
        <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-purple-500/30 via-cyan-500/20 to-purple-500/30 blur-sm" />
        <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-purple-500/10 via-transparent to-cyan-500/10" />

        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Logo/Title */}
            <motion.div variants={fadeUp} className="text-center">
              <h1
                className="bg-linear-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text font-heading text-4xl font-bold tracking-tight text-transparent"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.4)) drop-shadow(0 0 40px rgba(6,182,212,0.2))',
                }}
              >
                {t('login.title')}
              </h1>
              <p className="mt-3 text-sm text-slate-400">
                {t('login.subtitle')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {t('login.tagline')}
              </p>
            </motion.div>

            {/* Divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-xs tracking-widest text-slate-500">{t('login.divider_text')}</span>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Google Sign In */}
            <motion.div variants={fadeUp}>
              <button
                onClick={handleGoogleSignIn}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition-all hover:border-purple-500/50 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]"
              >
                <Chrome className="h-5 w-5 text-cyan-400 transition-colors group-hover:text-cyan-300" />
                {t('login.google_button')}
              </button>
            </motion.div>

            {/* Footer */}
            <motion.p variants={fadeUp} className="text-center text-xs text-slate-600">
              {t('login.terms')}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
