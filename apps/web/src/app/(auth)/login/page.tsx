'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Chrome, Mail, Loader2, Eye, EyeOff } from 'lucide-react'
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
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) return

    setLoading(true)
    setError(null)

    const supabase = createClient()
    if (!supabase) {
      setError(t('login.error_generic'))
      setLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError(
        authError.message.includes('Invalid login')
          ? t('login.error_invalid')
          : t('login.error_generic')
      )
      setLoading(false)
      return
    }

    // Successful login — let middleware handle role-based routing
    router.push('/')
    router.refresh()
  }

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
            className="space-y-6"
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

            {/* Email/Password Form */}
            <motion.form variants={fadeUp} onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">{t('login.email_label')}</label>
                <input
                  type="email"
                  placeholder={t('login.email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">{t('login.password_label')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-600/20 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-purple-600/30 hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4 text-purple-400" />
                )}
                {t('login.email_button')}
              </button>
            </motion.form>

            {/* Or divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-[10px] uppercase tracking-widest text-slate-600">{t('login.or_divider')}</span>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
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
