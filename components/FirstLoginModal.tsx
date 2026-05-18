'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './FirstLoginModal.module.css'

type CodeStatus = 'idle' | 'checking' | 'valid' | 'invalid'

export default function FirstLoginModal() {
  const { tr } = useLanguage()
  const p = tr.firstLoginModal
  const { data: session, status, update } = useSession()

  const [code, setCode] = useState('')
  const [codeStatus, setCodeStatus] = useState<CodeStatus>('idle')
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const visible = status === 'authenticated' && session?.user?.onboardingDone === false

  const validateCode = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = value.trim()
    if (!trimmed) { setCodeStatus('idle'); return }
    setCodeStatus('checking')
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/referral/validate?code=${encodeURIComponent(trimmed)}`)
        const data = await r.json()
        setCodeStatus(data.valid ? 'valid' : 'invalid')
      } catch {
        setCodeStatus('invalid')
      }
    }, 500)
  }, [])

  useEffect(() => {
    validateCode(code)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [code, validateCode])

  async function complete(referralCode?: string) {
    setSaving(true)
    try {
      await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode }),
      })
      await update()
    } finally {
      setSaving(false)
    }
  }

  function handleSave() {
    complete(codeStatus === 'valid' ? code.trim() : undefined)
  }

  function handleSkip() {
    complete(undefined)
  }

  const saveDisabled = saving || codeStatus === 'checking' || (code.trim() !== '' && codeStatus === 'invalid')

  if (!visible) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2 className={styles.title}>{p.title}</h2>
        <p className={styles.sub}>{p.sub}</p>

        <div className={styles.field}>
          <label className={styles.label}>{p.referralLabel}</label>
          <input
            className={styles.input}
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder={p.referralPlaceholder}
            disabled={saving}
            maxLength={9}
            autoComplete="off"
          />
          {codeStatus === 'checking' && (
            <span className={styles.hint}>{p.referralChecking}</span>
          )}
          {codeStatus === 'valid' && (
            <span className={`${styles.hint} ${styles.hintValid}`}>{p.referralValid}</span>
          )}
          {codeStatus === 'invalid' && (
            <span className={`${styles.hint} ${styles.hintInvalid}`}>{p.referralInvalid}</span>
          )}
        </div>

        <button className={styles.cta} onClick={handleSave} disabled={saveDisabled}>
          {saving ? p.saving : p.saveBtn}
        </button>
        <button className={styles.skip} onClick={handleSkip} disabled={saving}>
          {p.skipBtn}
        </button>
      </div>
    </div>
  )
}
