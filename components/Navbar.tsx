'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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

export default function Navbar() {
  const { lang, toggle, tr } = useLanguage()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { data: session, status } = useSession()

  const closeMenu = () => setMenuOpen(false)

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
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
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={32}
                  height={32}
                  className={styles.avatarImg}
                />
              ) : (
                <span className={styles.avatarInitials}>{initials}</span>
              )}
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
                  <button
                    className={styles.dropdownLogout}
                    onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: '/' }) }}
                  >
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link href="/login" className={styles.loginLink}>
            Masuk
          </Link>
        )}

        <Link href="#order" className={styles.cta}>
          {tr.nav.cta}
        </Link>
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

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileOverlay} onClick={closeMenu} />
          <div className={styles.mobilePanel}>
            <div className={styles.mobilePanelTop}>
              <span className={styles.mobileLogo}>RHP<span>Creatives</span></span>
              <button className={styles.closeBtn} onClick={closeMenu}>✕</button>
            </div>

            {session && (
              <div className={styles.mobileUser}>
                <div className={styles.mobileAvatarWrap}>
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      width={36}
                      height={36}
                      className={styles.avatarImg}
                    />
                  ) : (
                    <span className={styles.mobileAvatarInitials}>{initials}</span>
                  )}
                </div>
                <div>
                  <p className={styles.mobileUserName}>{session.user?.name}</p>
                  <p className={styles.mobileUserEmail}>{session.user?.email}</p>
                </div>
              </div>
            )}

            <ul className={styles.mobileLinks}>
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key}>
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
                <button
                  className={styles.mobileLogoutBtn}
                  onClick={() => { closeMenu(); signOut({ callbackUrl: '/' }) }}
                >
                  Keluar
                </button>
              ) : (
                <Link href="/login" className={styles.mobileLoginBtn} onClick={closeMenu}>
                  Masuk
                </Link>
              )}
              <Link href="#order" className={styles.mobileCtaBtn} onClick={closeMenu}>
                {tr.nav.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
