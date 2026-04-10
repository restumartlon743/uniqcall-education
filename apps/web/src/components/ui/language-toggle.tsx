'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import type { Language } from '@/lib/i18n/translations'

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'id', label: 'ID' },
]

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md transition-all',
          'hover:border-purple-500/30 hover:bg-white/10 hover:text-white',
          open && 'border-purple-500/40 bg-white/10 text-white shadow-[0_0_12px_rgba(139,92,246,0.15)]',
        )}
        aria-label="Change language"
      >
        {/* Globe SVG icon */}
        <svg
          className="h-3.5 w-3.5 text-cyan-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{lang.toUpperCase()}</span>
        {/* Chevron */}
        <svg
          className={cn('h-3 w-3 text-slate-500 transition-transform', open && 'rotate-180')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-25 overflow-hidden rounded-xl border border-white/10 bg-[#151B3B]/95 p-1 shadow-xl backdrop-blur-xl">
          {LANGUAGES.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                setLang(item.code)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all',
                lang === item.code
                  ? 'bg-purple-500/15 text-purple-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  lang === item.code ? 'bg-purple-400' : 'bg-slate-600',
                )}
              />
              {item.label}
              <span className="text-[10px] text-slate-500">
                {item.code === 'en' ? 'English' : 'Indonesia'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
