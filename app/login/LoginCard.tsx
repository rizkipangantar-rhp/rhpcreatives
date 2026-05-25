'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './login.module.css'

export default function LoginCard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const { tr } = useLanguage()
  const a = tr.auth

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Check if email exists first for a specific error message
    try {
      const check = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then(r => r.json()) as { exists: boolean; provider: string | null }

      if (!check.exists) {
        setError(a.errorEmailNotFound ?? 'Email tidak terdaftar. Daftar dulu ya!')
        setLoading(false)
        return
      }
      if (check.provider === 'google') {
        setError(a.errorGoogleOnly ?? 'Akun ini terdaftar via Google. Gunakan tombol "Masuk dengan Google".')
        setLoading(false)
        return
      }
    } catch {
      // If check fails, fall through to normal sign-in
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    })
    setLoading(false)
    if (res?.error) {
      setError(a.errorWrongPassword ?? a.errorInvalid)
    } else {
      router.push(callbackUrl)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch {
      setGoogleLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardTop}>
          <Link href="/" className={styles.brandLogo}>
            RHP<span>Creatives</span>
          </Link>
          <h1 className={styles.title}>{a.loginTitle}</h1>
          <p className={styles.sub}>{a.loginSub}</p>
        </div>

        <button
          className={styles.googleBtn}
          onClick={handleGoogle}
          disabled={googleLoading}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {googleLoading ? a.googleConnecting : a.googleBtn}
        </button>

        <div className={styles.divider}>
          <span />
          <span className={styles.dividerText}>{a.orDivider}</span>
          <span />
        </div>

        <form onSubmit={handleCredentials} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label htmlFor="email">{a.emailLabel}</label>
            <input
              id="email"
              type="email"
              placeholder={a.emailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">{a.passwordLabel}</label>
            <input
              id="password"
              type="password"
              placeholder={a.passwordPlaceholder}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? a.loggingIn : a.submitLogin}
          </button>
        </form>

        <p className={styles.footer}>
          {a.noAccount}{' '}
          <Link href="/register">{a.registerLink}</Link>
        </p>
      </div>
    </main>
  )
}
