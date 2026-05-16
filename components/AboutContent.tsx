'use client'
import { useLanguage } from '@/context/LanguageContext'
import styles from './AboutContent.module.css'

const WHY_ICONS = [
  <svg key="price" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M9 8.5h4.5a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3H15" />
  </svg>,
  <svg key="speed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>,
  <svg key="revision" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>,
  <svg key="chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>,
  <svg key="custom" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>,
  <svg key="quality" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
]

const VISION_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const MISSION_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

export default function AboutContent() {
  const { tr } = useLanguage()
  const a = tr.about

  return (
    <>
      {/* Profile + Vision / Mission */}
      <section className={styles.profileSection}>
        <div className={styles.profileGrid}>
          <div className={styles.profileCard}>
            <div className={styles.sectionLabel}>{a.profileLabel}</div>
            <h2 className={styles.profileTitle}>{a.profileTitle}</h2>
            <p className={styles.profileText}>{a.profileText}</p>
          </div>
          <div className={styles.vmGrid}>
            <div className={styles.vmCard}>
              <div className={styles.vmIcon}>{VISION_ICON}</div>
              <div className={styles.vmTitle}>{a.visionTitle}</div>
              <p className={styles.vmText}>{a.visionText}</p>
            </div>
            <div className={styles.vmCard}>
              <div className={styles.vmIcon}>{MISSION_ICON}</div>
              <div className={styles.vmTitle}>{a.missionTitle}</div>
              <p className={styles.vmText}>{a.missionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className={styles.statsInner}>
          <div className={styles.statsLabel}>{a.statsLabel}</div>
          <div className={styles.statsGrid}>
            {a.stats.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.statNum}>{stat.num}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className={styles.whySection}>
        <div className={styles.whyLabel}>{a.whyLabel}</div>
        <h2 className={styles.whyTitle}>{a.whyTitle}</h2>
        <div className={styles.whyGrid}>
          {a.whyItems.map((item, i) => (
            <div key={item.title} className={styles.whyCard}>
              <div className={styles.whyIcon}>{WHY_ICONS[i]}</div>
              <div className={styles.whyCardTitle}>{item.title}</div>
              <div className={styles.whyCardDesc}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
