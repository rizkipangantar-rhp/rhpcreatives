'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { key: 'home' as const, href: '/' },
  { key: 'layananDigital' as const, href: '/layanan-digital' },
  { key: 'layananDesain' as const, href: '/layanan-desain' },
  { key: 'testimoni' as const, href: '/testimoni' },
  { key: 'promo' as const, href: '/promo' },
  { key: 'about' as const, href: '/about' },
]

function Avatar({ src, name, size, className }: { src?: string | null; name?: string | null; size: number; className?: string }) {
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
        width={size}
        height={size}
        className={className}
        onError={() => setImgError(true)}
      />
    )
  }

  return <span className={styles.avatarInitials}>{initials}</span>
}

export default function Navbar() {
  const { lang, toggle, tr } = useLanguage()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { data: session, status } = useSession()

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo} onClick={closeMenu}>
        RHP<span>Creatives</span>
      </Link>

      <ul className={styles.links}>
        {NAV_LINKS.map(({ key, href }) => (
          <li key={key}>
            <Link
              href={href}
              className={`${pathname === href ? styles.linkActive : ''} ${key === 'promo' ? styles.linkPromo : ''}`}
            >
              {tr.nav[key]}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.navRight}>
        <button className={styles.langToggle} onClick={toggle} aria-label="Switch language">
          <span className={lang === 'id' ? styles.langActive : ''}>ID</span>
          <span className={styles.langSep}>/</span>
          <span className={lang === 'en' ? styles.langActive : ''}>EN</span>
        </button>

        {status === 'loading' ? null : session ? (
          <div className={styles.userMenu}>
            <button
              className={styles.avatar}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User menu"
            >
              <Avatar src={session.user?.image} name={session.user?.name} size={32} className={styles.avatarImg} />
            </button>
            {dropdownOpen && (
              <>
                <div className={styles.dropdownOverlay} onClick={() => setDropdownOpen(false)} />
                <div className={styles.dropdown}>
                  <div className={styles.dropdownUser}>
                    <span className={styles.dropdownName}>{session.user?.name}</span>
                    <span className={styles.dropdownEmail}>{session.user?.email}</span>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link
                    href="/dashboard/profil"
                    className={styles.dropdownLink}
                    onClick={() => setDropdownOpen(false)}
                  >
                    {tr.nav.profileLink}
                  </Link>
                  <Link
                    href="/order/custom"
                    className={styles.dropdownLink}
                    onClick={() => setDropdownOpen(false)}
                  >
                    {tr.nav.customOrder}
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button
                    className={styles.dropdownLogout}
                    onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: '/' }) }}
                  >
                    {tr.nav.logout}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link href="/login" className={styles.loginLink}>
            {tr.nav.login}
          </Link>
        )}

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

    </nav>

      {menuOpen && (
        <>
          <div className={styles.mobileOverlay} onClick={closeMenu} />
          <div className={styles.mobileMenu}>
          <div className={styles.mobilePanelTop}>
            <span className={styles.mobileLogo}>RHP<span>Creatives</span></span>
            <button className={styles.closeBtn} onClick={closeMenu}>✕</button>
          </div>

          {session && (
            <div className={styles.mobileUser}>
              <div className={styles.mobileAvatarWrap}>
                <Avatar src={session.user?.image} name={session.user?.name} size={36} className={styles.avatarImg} />
              </div>
              <div>
                <p className={styles.mobileUserName}>{session.user?.name}</p>
                <p className={styles.mobileUserEmail}>{session.user?.email}</p>
              </div>
            </div>
          )}

          <ul className={styles.mobileLinks}>
            {NAV_LINKS.map(({ key, href }, i) => (
              <li key={key} style={{ animationDelay: `${0.06 + i * 0.05}s` }}>
                <Link
                  href={href}
                  className={`${pathname === href ? styles.mobileLinkActive : ''} ${key === 'promo' ? styles.mobileLinkPromo : ''}`}
                  onClick={closeMenu}
                >
                  {tr.nav[key]}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.mobileCta}>
            <button className={styles.mobileLangToggle} onClick={toggle}>
              {lang === 'id' ? 'ID → Switch to English' : 'EN → Ganti ke Indonesia'}
            </button>
            {session ? (
              <>
                <Link href="/dashboard/profil" className={styles.mobileLoginBtn} onClick={closeMenu}>
                  {tr.nav.profileLink}
                </Link>
                <Link href="/order/custom" className={styles.mobileLoginBtn} onClick={closeMenu} style={{ background: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.3)' }}>
                  {tr.nav.customOrder}
                </Link>
                <button
                  className={styles.mobileLogoutBtn}
                  onClick={() => { closeMenu(); signOut({ callbackUrl: '/' }) }}
                >
                  {tr.nav.logout}
                </button>
              </>
            ) : (
              <Link href="/login" className={styles.mobileLoginBtn} onClick={closeMenu}>
                {tr.nav.login}
              </Link>
            )}
          </div>
          </div>
        </>
      )}
    </>
  )
}
