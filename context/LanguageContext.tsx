'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Lang, Tr, t } from '@/lib/i18n'

interface LangCtx {
  lang: Lang
  toggle: () => void
  tr: Tr
}

const LanguageContext = createContext<LangCtx>({
  lang: 'id',
  toggle: () => {},
  tr: t.id,
})

export function LanguageProvider({ children, initialLang = 'id' }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    // Migrate any localStorage-only preference to cookie (for users before this fix)
    const stored = localStorage.getItem('rhp-lang') as Lang | null
    if (stored && stored !== initialLang && !document.cookie.includes('rhp-lang=')) {
      document.cookie = `rhp-lang=${stored};path=/;max-age=31536000;SameSite=Lax`
      setLang(stored)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const toggle = () => setLang(l => {
    const next = l === 'id' ? 'en' : 'id'
    document.cookie = `rhp-lang=${next};path=/;max-age=31536000;SameSite=Lax`
    localStorage.setItem('rhp-lang', next)
    return next
  })

  return (
    <LanguageContext.Provider value={{ lang, toggle, tr: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
