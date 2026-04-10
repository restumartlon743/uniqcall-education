'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { GraduationCap, Heart, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedBackground } from '@/components/effects/animated-background'
import { GlowCard } from '@/components/effects/glow-card'

type RoleOption = 'teacher' | 'parent'

export default function OnboardingPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!selectedRole) return
    setLoading(true)
    setError(null)

    const supabase = createClient()

    // Demo mode: redirect directly
    if (!supabase) {
      router.push(selectedRole === 'teacher' ? '/teacher' : '/parent')
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Sesi tidak valid. Silakan login kembali.')
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
        setError('Kode sekolah tidak ditemukan.')
        setLoading(false)
        return
      }

      // Update profile with role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'teacher' })
        .eq('id', user.id)

      if (profileError) {
        setError('Gagal menyimpan profil.')
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
        setError('Gagal membuat profil guru.')
        setLoading(false)
        return
      }

      router.push('/teacher')
    } else {
      // Parent role — validate invite code
      const { data: invite } = await supabase
        .from('parent_invites')
        .select('id, student_id')
        .eq('invite_code', code.trim())
        .eq('used', false)
        .single()

      if (!invite) {
        setError('Kode undangan tidak valid atau sudah digunakan.')
        setLoading(false)
        return
      }

      // Update profile with role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'parent' })
        .eq('id', user.id)

      if (profileError) {
        setError('Gagal menyimpan profil.')
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
        setError('Gagal membuat profil orang tua.')
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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0E27]">
      <AnimatedBackground variant="hero" />

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
                Selamat Datang!
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Pilih peran Anda untuk memulai
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Siswa menggunakan aplikasi mobile
              </p>
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              <button
                onClick={() => {
                  setSelectedRole('teacher')
                  setCode('')
                  setError(null)
                }}
                className="group relative"
              >
                <GlowCard
                  glowColor="purple"
                  hoverEffect
                  className={cn(
                    'flex flex-col items-center gap-3 p-6 transition-all',
                    selectedRole === 'teacher'
                      ? 'border-purple-500/50 bg-purple-500/10 shadow-[0_0_25px_rgba(139,92,246,0.3)]'
                      : ''
                  )}
                >
                  <GraduationCap
                    className={cn(
                      'h-8 w-8 transition-colors',
                      selectedRole === 'teacher'
                        ? 'text-purple-400'
                        : 'text-slate-400 group-hover:text-purple-300'
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm font-medium',
                      selectedRole === 'teacher'
                        ? 'text-purple-300'
                        : 'text-slate-300'
                    )}
                  >
                    Saya Guru
                  </span>
                </GlowCard>
              </button>

              <button
                onClick={() => {
                  setSelectedRole('parent')
                  setCode('')
                  setError(null)
                }}
                className="group relative"
              >
                <GlowCard
                  glowColor="cyan"
                  hoverEffect
                  className={cn(
                    'flex flex-col items-center gap-3 p-6 transition-all',
                    selectedRole === 'parent'
                      ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                      : ''
                  )}
                >
                  <Heart
                    className={cn(
                      'h-8 w-8 transition-colors',
                      selectedRole === 'parent'
                        ? 'text-cyan-400'
                        : 'text-slate-400 group-hover:text-cyan-300'
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm font-medium',
                      selectedRole === 'parent'
                        ? 'text-cyan-300'
                        : 'text-slate-300'
                    )}
                  >
                    Saya Orang Tua
                  </span>
                </GlowCard>
              </button>
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
                    {selectedRole === 'teacher'
                      ? 'Masukkan Kode Sekolah'
                      : 'Masukkan Kode Undangan'}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={
                      selectedRole === 'teacher'
                        ? 'Contoh: SKL-XXXXX'
                        : 'Contoh: INV-XXXXX'
                    }
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
                    {loading ? 'Menyimpan...' : 'Lanjutkan'}
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
