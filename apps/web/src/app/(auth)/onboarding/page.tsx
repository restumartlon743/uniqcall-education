'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { GraduationCap, Heart, BookOpen, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedBackground } from '@/components/effects/animated-background'
import { GlowCard } from '@/components/effects/glow-card'
import { useLanguage } from '@/lib/i18n/context'
import { LanguageToggle } from '@/components/ui/language-toggle'

type RoleOption = 'teacher' | 'parent' | 'student'

export default function OnboardingPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!selectedRole) return
    setLoading(true)
    setError(null)

    const supabase = createClient()

    if (!supabase) {
      setError(t('onboarding.error_invalid_session'))
      setLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError(t('onboarding.error_invalid_session'))
      setLoading(false)
      return
    }

    if (selectedRole === 'teacher') {
      // Validate school code
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('school_code', code.trim())
        .single()

      if (!school) {
        setError(t('onboarding.error_school_not_found'))
        setLoading(false)
        return
      }

      // Update profile with role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'teacher' })
        .eq('id', user.id)

      if (profileError) {
        setError(t('onboarding.error_save_profile'))
        setLoading(false)
        return
      }

      // Create teacher record
      const { error: teacherError } = await supabase
        .from('teachers')
        .insert({
          id: user.id,
          school_id: school.id,
        })

      if (teacherError) {
        setError(t('onboarding.error_create_teacher'))
        setLoading(false)
        return
      }

      router.push('/teacher')
    } else if (selectedRole === 'student') {
      // Validate class code
      const { data: classData } = await supabase
        .from('classes')
        .select('id, school_id')
        .eq('class_code', code.trim())
        .single()

      if (!classData) {
        setError(t('onboarding.error_class_not_found'))
        setLoading(false)
        return
      }

      // Update profile with role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'student' })
        .eq('id', user.id)

      if (profileError) {
        setError(t('onboarding.error_save_profile'))
        setLoading(false)
        return
      }

      // Create student record
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          id: user.id,
          school_id: classData.school_id,
          class_id: classData.id,
        })

      if (studentError) {
        setError(t('onboarding.error_create_student'))
        setLoading(false)
        return
      }

      // Join class via class_members
      const { error: memberError } = await supabase
        .from('class_members')
        .insert({
          class_id: classData.id,
          student_id: user.id,
        })

      if (memberError) {
        setError(t('onboarding.error_create_student'))
        setLoading(false)
        return
      }

      router.push('/student')
    } else {
      // Parent role — validate invite code
      const { data: invite } = await supabase
        .from('parent_invites')
        .select('id, student_id')
        .eq('invite_code', code.trim())
        .eq('used', false)
        .single()

      if (!invite) {
        setError(t('onboarding.error_invalid_invite'))
        setLoading(false)
        return
      }

      // Update profile with role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'parent' })
        .eq('id', user.id)

      if (profileError) {
        setError(t('onboarding.error_save_profile'))
        setLoading(false)
        return
      }

      // Create parent-student link
      const { error: parentError } = await supabase
        .from('parents')
        .insert({
          id: user.id,
          student_id: invite.student_id,
        })

      if (parentError) {
        setError(t('onboarding.error_create_parent'))
        setLoading(false)
        return
      }

      // Mark invite as used
      await supabase
        .from('parent_invites')
        .update({ used: true })
        .eq('id', invite.id)

      router.push('/parent')
    }
  }

  function getCodeLabel(): string {
    if (selectedRole === 'teacher') return t('onboarding.school_code')
    if (selectedRole === 'student') return t('onboarding.class_code')
    return t('onboarding.invite_code')
  }

  function getCodePlaceholder(): string {
    if (selectedRole === 'teacher') return t('onboarding.school_code_placeholder')
    if (selectedRole === 'student') return t('onboarding.class_code_placeholder')
    return t('onboarding.invite_code_placeholder')
  }

  const roleCards: { role: RoleOption; icon: typeof GraduationCap; glowColor: 'purple' | 'cyan' | 'gold'; labelKey: string }[] = [
    { role: 'teacher', icon: GraduationCap, glowColor: 'purple', labelKey: 'onboarding.role_teacher' },
    { role: 'student', icon: BookOpen, glowColor: 'cyan', labelKey: 'onboarding.role_student' },
    { role: 'parent', icon: Heart, glowColor: 'gold', labelKey: 'onboarding.role_parent' },
  ]

  const glowColorMap = {
    purple: {
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/10',
      shadow: 'shadow-[0_0_25px_rgba(139,92,246,0.3)]',
      iconActive: 'text-purple-400',
      iconHover: 'group-hover:text-purple-300',
      textActive: 'text-purple-300',
    },
    cyan: {
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-500/10',
      shadow: 'shadow-[0_0_25px_rgba(6,182,212,0.3)]',
      iconActive: 'text-cyan-400',
      iconHover: 'group-hover:text-cyan-300',
      textActive: 'text-cyan-300',
    },
    gold: {
      border: 'border-amber-500/50',
      bg: 'bg-amber-500/10',
      shadow: 'shadow-[0_0_25px_rgba(245,158,11,0.3)]',
      iconActive: 'text-amber-400',
      iconHover: 'group-hover:text-amber-300',
      textActive: 'text-amber-300',
    },
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0E27]">
      <AnimatedBackground variant="hero" />

      {/* Language Toggle */}
      <div className="absolute right-4 top-4 z-20">
        <LanguageToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg"
      >
        <GlowCard glowColor="purple" className="p-8 shadow-2xl">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text font-heading text-3xl font-bold text-transparent">
                {t('onboarding.welcome')}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {t('onboarding.select_role')}
              </p>
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="grid grid-cols-3 gap-3"
            >
              {roleCards.map(({ role, icon: Icon, glowColor, labelKey }) => {
                const colors = glowColorMap[glowColor]
                const isSelected = selectedRole === role
                return (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role)
                      setCode('')
                      setError(null)
                    }}
                    className="group relative"
                  >
                    <GlowCard
                      glowColor={glowColor === 'gold' ? 'purple' : glowColor}
                      hoverEffect
                      className={cn(
                        'flex flex-col items-center gap-3 p-5 transition-all',
                        isSelected && `${colors.border} ${colors.bg} ${colors.shadow}`
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-7 w-7 transition-colors',
                          isSelected
                            ? colors.iconActive
                            : `text-slate-400 ${colors.iconHover}`
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-medium',
                          isSelected ? colors.textActive : 'text-slate-300'
                        )}
                      >
                        {t(labelKey)}
                      </span>
                    </GlowCard>
                  </button>
                )
              })}
            </motion.div>

            {/* Code Input */}
            <AnimatePresence mode="wait">
              {selectedRole && (
                <motion.div
                  key="code-input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="block text-sm text-slate-400">
                    {getCodeLabel()}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={getCodePlaceholder()}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <AnimatePresence>
              {selectedRole && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !code.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 px-6 py-3.5 text-sm font-medium text-white transition-all hover:from-purple-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? t('onboarding.processing') : t('onboarding.continue')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlowCard>
      </motion.div>
    </div>
  )
}
