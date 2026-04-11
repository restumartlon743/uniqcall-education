'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Chrome, Mail, Loader2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/lib/i18n/context'
import { LanguageToggle } from '@/components/ui/language-toggle'

const AnimatedBackground = dynamic(
  () => import('@/components/effects/animated-background').then((m) => m.AnimatedBackground),
  { ssr: false }
)

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0E27]">
      <AnimatedBackground variant="dashboard" />

      {/* Language Toggle */}
      <div className="absolute right-4 top-4 z-20">
        <LanguageToggle />
      </div>

      {/* Login Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Title */}
            <motion.div variants={fadeUp} className="text-center">
              <h1 className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text font-heading text-3xl font-bold tracking-tight text-transparent">
                {t('login.title')}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {t('login.subtitle')}
              </p>
            </motion.div>

            {/* Email/Password Form */}
            <motion.form variants={fadeUp} onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">
                  {t('login.email_label')}
                </label>
                <input
                  type="email"
                  placeholder={t('login.email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">
                  {t('login.password_label')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400 text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {t('login.email_button')}
              </button>
            </motion.form>

            {/* Divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-slate-600">
                {t('login.or_divider')}
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </motion.div>

            {/* Google Sign In */}
            <motion.div variants={fadeUp}>
              <button
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                <Chrome className="h-4 w-4 text-slate-400" />
                {t('login.google_button')}
              </button>
            </motion.div>

            {/* Footer */}
            <motion.p variants={fadeUp} className="text-center text-[11px] text-slate-600">
              {t('login.terms')}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
