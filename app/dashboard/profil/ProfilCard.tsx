'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import styles from './profil.module.css'

function generateReferralCode(email: string): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i)
    hash |= 0
  }
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  let n = Math.abs(hash)
  for (let i = 0; i < 5; i++) {
    code += chars[n % chars.length]
    n = Math.floor(n / chars.length)
  }
  return `RHP-${code}`
}

function AvatarDisplay({ src, name }: { src?: string | null; name?: string | null }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => { setImgError(false) }, [src])

  const initials = name
    ? name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={name ?? 'User'}
        width={96}
        height={96}
        className={styles.avatarImg}
        onError={() => setImgError(true)}
      />
    )
  }

  return <span className={styles.avatarInitials}>{initials}</span>
}

export default function ProfilCard({ session }: { session: Session }) {
  const { user } = session
  const referralCode = generateReferralCode(user.email ?? user.name ?? 'user')
  const [copied, setCopied] = useState(false)

  function copyCode() {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <main className={styles.page}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />

      <div className={styles.container}>
        {/* Profile card */}
        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <AvatarDisplay src={user.image} name={user.name} />
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{user.name ?? 'Pengguna'}</h1>
            <p className={styles.email}>{user.email}</p>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Keluar
          </button>
        </div>

        <div className={styles.grid}>
          {/* Referral code card */}
          <div className={styles.card}>
            <div className={styles.cardLabel}>Kode Referral Kamu</div>
            <div className={styles.referralCode}>{referralCode}</div>
            <button className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ''}`} onClick={copyCode}>
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Tersalin!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Salin Kode
                </>
              )}
            </button>
            <p className={styles.cardNote}>
              Bagikan kode ini ke teman-teman kamu
            </p>
          </div>

          {/* Reward info card */}
          <div className={styles.card}>
            <div className={styles.cardLabel}>Reward Referral</div>
            <div className={styles.rewardList}>
              <div className={styles.rewardItem}>
                <div className={styles.rewardBadge}>15%</div>
                <div>
                  <p className={styles.rewardTitle}>Kamu (pengajak)</p>
                  <p className={styles.rewardDesc}>Diskon 15% untuk order berikutnya</p>
                </div>
              </div>
              <div className={styles.rewardDivider} />
              <div className={styles.rewardItem}>
                <div className={`${styles.rewardBadge} ${styles.rewardBadgePink}`}>10%</div>
                <div>
                  <p className={styles.rewardTitle}>Teman kamu (diajak)</p>
                  <p className={styles.rewardDesc}>Diskon 10% untuk order pertamanya</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div className={styles.card}>
            <div className={styles.cardLabel}>Statistik Referral</div>
            <div className={styles.statGrid}>
              <div className={styles.stat}>
                <span className={styles.statValue}>0</span>
                <span className={styles.statLabel}>Orang pakai kode</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>Rp 0</span>
                <span className={styles.statLabel}>Total reward didapat</span>
              </div>
            </div>
            <p className={styles.cardNote}>
              Statistik update otomatis saat teman menggunakan kode referral kamu
            </p>
          </div>

          {/* How to use card */}
          <div className={styles.card}>
            <div className={styles.cardLabel}>Cara Pakai Referral</div>
            <ol className={styles.stepList}>
              <li className={styles.step}>
                <span className={styles.stepNum}>1</span>
                <span>Salin kode referral kamu di atas</span>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNum}>2</span>
                <span>Bagikan ke teman yang mau order jasa RHP Creatives</span>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNum}>3</span>
                <span>Teman daftar & sebutkan kode saat order via WhatsApp</span>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNum}>4</span>
                <span>Kalian berdua otomatis dapat diskon!</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}
