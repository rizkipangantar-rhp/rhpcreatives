import styles from './promo-loading.module.css'

export default function PromoLoading() {
  return (
    <div className={styles.wrap}>
      {/* Hero skeleton */}
      <div className={styles.hero}>
        <div className={`${styles.skel} ${styles.skelLabel}`} />
        <div className={`${styles.skel} ${styles.skelTitle}`} />
        <div className={`${styles.skel} ${styles.skelSub}`} />
      </div>

      {/* Promo card skeleton */}
      <div className={styles.section}>
        <div className={styles.promoCard}>
          <div className={`${styles.skel} ${styles.skelBadge}`} />
          <div className={`${styles.skel} ${styles.skelH2}`} />
          <div className={`${styles.skel} ${styles.skelDesc}`} />
          <div className={`${styles.skel} ${styles.skelDesc} ${styles.skelDescShort}`} />
          <div className={styles.statsRow}>
            <div className={`${styles.skel} ${styles.skelStat}`} />
            <div className={`${styles.skel} ${styles.skelStat}`} />
          </div>
          <div className={`${styles.skel} ${styles.skelBtn}`} />
        </div>
      </div>

      {/* Bundle cards skeleton */}
      <div className={styles.sectionAlt}>
        <div className={`${styles.skel} ${styles.skelLabel}`} />
        <div className={`${styles.skel} ${styles.skelTitle}`} />
        <div className={styles.bundleGrid}>
          <div className={`${styles.skel} ${styles.skelCard}`} />
          <div className={`${styles.skel} ${styles.skelCard}`} />
          <div className={`${styles.skel} ${styles.skelCardWide}`} />
        </div>
      </div>
    </div>
  )
}
