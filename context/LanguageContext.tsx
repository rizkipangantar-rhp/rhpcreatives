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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('id')

  useEffect(() => {
    const saved = localStorage.getItem('rhp-lang') as Lang | null
    if (saved === 'en') setLang('en')
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const toggle = () => setLang(l => {
    const next = l === 'id' ? 'en' : 'id'
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
