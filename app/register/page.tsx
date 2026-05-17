'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './register.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const { tr } = useLanguage()
  const a = tr.auth

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError(a.passwordMismatch)
      return
    }

    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Error')
      setLoading(false)
      return
    }

    const signin = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/',
    })

    setLoading(false)
    if (signin?.ok) {
      router.push('/')
    } else {
      router.push('/login')
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
          <h1 className={styles.title}>{a.registerTitle}</h1>
          <p className={styles.sub}>{a.registerSub}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label htmlFor="name">{a.nameLabel}</label>
            <input
              id="name"
              type="text"
              placeholder={a.namePlaceholder}
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

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
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirm">{a.confirmLabel}</label>
            <input
              id="confirm"
              type="password"
              placeholder={a.confirmPlaceholder}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? a.registering : a.submitRegister}
          </button>
        </form>

        <p className={styles.footer}>
          {a.hasAccount}{' '}
          <Link href="/login">{a.loginLink}</Link>
        </p>
      </div>
    </main>
  )
}
