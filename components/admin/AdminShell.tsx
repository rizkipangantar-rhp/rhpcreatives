'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import styles from './AdminShell.module.css'

type NavItem = { href: string; icon: string; label: string }

const NAV: NavItem[] = [
  { href: '/admin',              icon: '📊', label: 'Overview' },
  { href: '/admin/orders',       icon: '📦', label: 'Orders' },
  { href: '/admin/users',        icon: '👥', label: 'Users' },
  { href: '/admin/early-bird',   icon: '🎫', label: 'Early Bird' },
  { href: '/admin/referral',     icon: '🔗', label: 'Referral' },
  { href: '/admin/pendapatan',   icon: '💰', label: 'Pendapatan' },
  { href: '/admin/pengaturan',   icon: '⚙️', label: 'Pengaturan' },
]

export default function AdminShell({ session, children }: { session: Session; children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname?.startsWith(href) ?? false
  }

  const current = NAV.find(n => isActive(n.href))
  const initials = (session.user?.name ?? 'A').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className={styles.shell}>
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.logo}>
          <span className={styles.logoRhp}>RHP</span>
          <div className={styles.logoRight}>
            <span className={styles.logoAdmin}>Admin</span>
            <span className={styles.logoBadge}>Dashboard</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <footer className={styles.sidebarFooter}>
          RHP Admin Panel v1.0
        </footer>
      </aside>

      <div className={styles.body}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.hamburger} onClick={() => setOpen(s => !s)} aria-label="Toggle menu">
              <span /><span /><span />
            </button>
            <nav className={styles.breadcrumb}>
              <span className={styles.bcRoot}>Admin</span>
              {current && current.href !== '/admin' && (
                <><span className={styles.bcSep}>/</span><span className={styles.bcPage}>{current.label}</span></>
              )}
            </nav>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userChip}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{session.user?.name ?? 'Admin'}</span>
                <span className={styles.userRole}>Administrator</span>
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/' })} title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>

        <footer className={styles.footer}>
          RHP Creatives Admin Panel v1.0 — rhpcreativesid@gmail.com
        </footer>
      </div>
    </div>
  )
}
