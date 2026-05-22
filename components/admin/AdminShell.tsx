'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import styles from './AdminShell.module.css'

type NavItem = { href: string; icon: string; label: string; minRole?: string }

const NAV: NavItem[] = [
  { href: '/admin',                icon: '📊', label: 'Overview' },
  { href: '/admin/orders',         icon: '📦', label: 'Orders' },
  { href: '/admin/custom-orders',  icon: '✨', label: 'Custom Orders' },
  { href: '/admin/users',          icon: '👥', label: 'Users' },
  { href: '/admin/promo',          icon: '🎫', label: 'Promo' },
  { href: '/admin/early-bird',     icon: '🐦', label: 'Early Bird' },
  { href: '/admin/referral',       icon: '🔗', label: 'Referral' },
  { href: '/admin/pendapatan',     icon: '💰', label: 'Pendapatan' },
  { href: '/admin/pengaturan',     icon: '⚙️', label: 'Pengaturan', minRole: 'super_admin' },
]

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  cs: 'Customer Service',
}

function navAllowed(item: NavItem, role?: string): boolean {
  if (role === 'cs') return item.href === '/admin/orders' || item.href === '/admin/custom-orders'
  if (role === 'admin') return item.minRole !== 'super_admin'
  return true
}

export default function AdminShell({ session, children }: { session: Session; children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [customOrderCount, setCustomOrderCount] = useState(0)
  const role = session.user?.role as string | undefined

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    fetch('/api/admin/custom-orders/count')
      .then(r => r.ok ? r.json() : { count: 0 })
      .then(d => setCustomOrderCount(d.count ?? 0))
      .catch(() => {})
  }, [pathname])

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname?.startsWith(href) ?? false
  }

  const visibleNav = NAV.filter(item => navAllowed(item, role))
  const current = visibleNav.find(n => isActive(n.href))
  const initials = (session.user?.name ?? 'A').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const roleLabel = ROLE_LABELS[role ?? ''] ?? 'Administrator'

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
          {visibleNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {item.href === '/admin/custom-orders' && customOrderCount > 0 && (
                <span style={{ marginLeft: 'auto', background: '#fbbf24', color: '#0a0a0f', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: 999, lineHeight: 1.5 }}>
                  {customOrderCount}
                </span>
              )}
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
                <span className={styles.userRole}>{roleLabel}</span>
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
