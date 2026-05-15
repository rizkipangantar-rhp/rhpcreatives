'use client'
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        RHP<span>Creatives</span>
      </div>
      <ul className={styles.links}>
        <li><Link href="#layanan">Layanan</Link></li>
        <li><Link href="#harga">Harga</Link></li>
        <li><Link href="#testimoni">Testimoni</Link></li>
      </ul>
      <Link href="#order" className={styles.cta}>
        Order Sekarang →
      </Link>
    </nav>
  )
}
