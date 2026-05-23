import s from './admin.module.css'

export default function AdminLoading() {
  return (
    <div className={s.loading}>
      <div className={s.loadingLogo}>
        RHP<span>Creatives</span>
      </div>
      <div className={s.loadingRings}>
        <div className={s.ring1} />
        <div className={s.ring2} />
        <div className={s.ringDot} />
      </div>
      <p className={s.loadingText}>Memuat data…</p>
    </div>
  )
}
