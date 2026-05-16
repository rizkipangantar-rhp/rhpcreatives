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
    document.documentElement.lang = lang
  }, [lang])

  const toggle = () => setLang(l => (l === 'id' ? 'en' : 'id'))

  return (
    <LanguageContext.Provider value={{ lang, toggle, tr: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
