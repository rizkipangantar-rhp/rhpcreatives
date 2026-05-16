'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Services.module.css'

const DIGITAL_ICONS = [
  <svg key="01" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5z" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>,
  <svg key="02" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>,
  <svg key="03" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>,
]

const DESIGN_ICONS = [
  <svg key="04" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>,
  <svg key="05" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>,
  <svg key="06" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>,
]

interface ServicesProps {
  filter?: 'digital' | 'design' | 'all'
  showHeader?: boolean
}

export default function Services({ filter = 'all', showHeader = true }: ServicesProps) {
  const { tr } = useLanguage()
  const s = tr.services

  const showDigital = filter === 'all' || filter === 'digital'
  const showDesign = filter === 'all' || filter === 'design'

  return (
    <section className={styles.services}>
      {showHeader && (
        <div className={styles.header}>
          <div>
            <div className={styles.label}>{s.label}</div>
            <h2 className={styles.title}>{s.title}</h2>
            <p className={styles.sub}>{s.sub}</p>
          </div>
          <Link href="#order" className={styles.headerCta}>{s.headerCta}</Link>
        </div>
      )}

      {showDigital && (
        <>
          <div className={styles.categoryLabel}>{s.digitalLabel}</div>
          <div className={styles.gridDigital}>
            {s.digital.map((item, i) => (
              <div key={item.num} className={styles.card}>
                <div className={styles.num}>{item.num}</div>
                <div className={styles.icon}>{DIGITAL_ICONS[i]}</div>
                <div className={styles.name}>{item.name}</div>
                <div className={styles.desc}>{item.desc}</div>
                <ul className={styles.features}>
                  {item.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {showDesign && (
        <>
          <div className={styles.categoryLabel} style={{ marginTop: filter === 'all' ? '3rem' : undefined }}>
            {s.designLabel}
          </div>
          <div className={styles.gridDesign}>
            {s.design.map((item, i) => (
              <div key={item.num} className={styles.card}>
                <div className={styles.num}>{item.num}</div>
                <div className={styles.icon}>{DESIGN_ICONS[i]}</div>
                <div className={styles.name}>{item.name}</div>
                <div className={styles.desc}>{item.desc}</div>
                <ul className={styles.features}>
                  {item.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
