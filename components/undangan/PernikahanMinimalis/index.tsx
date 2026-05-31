import type { Invitation } from '@/lib/invitations'
import Countdown from './Countdown'
import RsvpForm from './RsvpForm'
import MusicPlayer from './MusicPlayer'
import PhotoGallery from './PhotoGallery'

type Props = { inv: Invitation; guestName?: string }

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

const isAesthetic = (pkg: string) => pkg === 'aesthetic' || pkg === 'sultan'
const isSultan = (pkg: string) => pkg === 'sultan'

export default function PernikahanMinimalis({ inv, guestName }: Props) {
  const aesthetic = isAesthetic(inv.package)
  const sultan = isSultan(inv.package)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0f0e17 0%, #1a1625 50%, #0f0e17 100%)',
      color: '#f1f5f9',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      overflowX: 'hidden',
    }}>
      {/* ── Music Player ── */}
      {sultan && inv.musicUrl && <MusicPlayer src={inv.musicUrl} />}

      {/* ── Hero Section ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px 60px',
        position: 'relative',
      }}>
        {/* Decorative top line */}
        <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, transparent, rgba(201,168,124,0.6))', marginBottom: 32 }} />

        <p style={{ fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a87c', marginBottom: 20 }}>
          Undangan Pernikahan
        </p>

        {/* Arabic Bismillah */}
        <p style={{ fontSize: '1.6rem', color: 'rgba(201,168,124,0.8)', marginBottom: 20, lineHeight: 1.6, fontFamily: 'serif' }}>
          بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>

        {/* Couple names */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
          fontWeight: 400,
          color: '#f8f4ef',
          margin: '0 0 8px',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          {inv.groomName}
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(201,168,124,0.7)', marginBottom: 8, letterSpacing: '0.15em' }}>&amp;</p>
        <h1 style={{
          fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
          fontWeight: 400,
          color: '#f8f4ef',
          margin: '0 0 32px',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          {inv.brideName}
        </h1>

        {/* Date pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(201,168,124,0.12)', border: '1px solid rgba(201,168,124,0.3)',
          borderRadius: 999, padding: '10px 24px',
          color: '#c9a87c', fontSize: '0.87rem', letterSpacing: '0.06em',
        }}>
          <span>📅</span>
          <span>{fmtDate(inv.date)} · {inv.time} WIB</span>
        </div>

        {/* Guest name */}
        {guestName && (
          <div style={{ marginTop: 32, padding: '12px 24px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Kepada Yth.</p>
            <p style={{ color: '#f1f5f9', fontWeight: 600 }}>{guestName}</p>
          </div>
        )}

        {/* Decorative bottom line */}
        <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, rgba(201,168,124,0.6), transparent)', marginTop: 48 }} />
      </section>

      {/* ── Countdown ── */}
      {aesthetic && inv.countdownEnabled && (
        <section style={{ padding: '64px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <SectionLabel>Menuju Hari Bahagia</SectionLabel>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <Countdown targetDate={inv.date} targetTime={inv.time} />
          </div>
        </section>
      )}

      {/* ── Parents & Love Story ── */}
      {aesthetic && (inv.groomParents || inv.brideParents || inv.loveStory) && (
        <section style={{ padding: '64px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <SectionLabel>Putra–Putri</SectionLabel>

          <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {inv.groomParents && (
              <div style={familyCardStyle}>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8f4ef', marginBottom: 6 }}>{inv.groomName}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem' }}>{inv.groomParents}</p>
              </div>
            )}
            {inv.brideParents && (
              <div style={familyCardStyle}>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8f4ef', marginBottom: 6 }}>{inv.brideName}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem' }}>{inv.brideParents}</p>
              </div>
            )}
          </div>

          {inv.loveStory && (
            <div style={{ maxWidth: 600, margin: '40px auto 0', padding: '28px 32px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 }}>
              <p style={{ color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.9, fontSize: '0.94rem' }}>
                &ldquo;{inv.loveStory}&rdquo;
              </p>
            </div>
          )}
        </section>
      )}

      {/* ── Event Details ── */}
      <section style={{ padding: '64px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <SectionLabel>Detail Acara</SectionLabel>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={eventCardStyle}>
            <div style={eventIconStyle}>💍</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#c9a87c', marginBottom: 4 }}>Akad Nikah</h3>
            <p style={{ color: '#f1f5f9', fontWeight: 500, marginBottom: 4 }}>{fmtDate(inv.date)}</p>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem' }}>{inv.time} WIB</p>
            <div style={{ margin: '12px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }} />
            <p style={{ color: '#f1f5f9', fontWeight: 500, marginBottom: 4 }}>{inv.venue}</p>
            {inv.venueAddress && <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{inv.venueAddress}</p>}
          </div>
        </div>
      </section>

      {/* ── Google Maps ── */}
      {aesthetic && inv.mapsUrl && (
        <section style={{ padding: '0 24px 64px', borderTop: 'none' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <SectionLabel>Lokasi</SectionLabel>
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: 280 }}>
              <iframe
                src={inv.mapsUrl}
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Acara"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Photo Gallery ── */}
      {sultan && inv.photos.length > 0 && (
        <section style={{ padding: '64px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <SectionLabel>Galeri Foto</SectionLabel>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <PhotoGallery photos={inv.photos} />
          </div>
        </section>
      )}

      {/* ── RSVP ── */}
      {aesthetic && inv.rsvpEnabled && (
        <section style={{ padding: '64px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <SectionLabel>Konfirmasi Kehadiran</SectionLabel>
          <p style={{ color: '#94a3b8', fontSize: '0.87rem', marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>
            Mohon konfirmasi kehadiran Anda agar kami dapat mempersiapkan yang terbaik.
          </p>
          <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
            <RsvpForm invitationId={inv.id} guestName={guestName} />
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer style={{
        padding: '48px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{ fontSize: '0.78rem', color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
          Dengan penuh cinta
        </p>
        <p style={{ fontSize: '1.1rem', color: '#c9a87c' }}>
          {inv.groomName} & {inv.brideName}
        </p>
        <p style={{ marginTop: 24, fontSize: '0.7rem', color: '#2d3748' }}>
          Dibuat dengan RHP Creatives
        </p>
      </footer>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
      <div style={{ height: 1, width: 40, background: 'rgba(201,168,124,0.4)' }} />
      <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a87c', whiteSpace: 'nowrap' }}>
        {children}
      </p>
      <div style={{ height: 1, width: 40, background: 'rgba(201,168,124,0.4)' }} />
    </div>
  )
}

const familyCardStyle: React.CSSProperties = {
  padding: '20px 24px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16,
  textAlign: 'center',
}

const eventCardStyle: React.CSSProperties = {
  padding: '28px 24px',
  background: 'rgba(201,168,124,0.06)',
  border: '1px solid rgba(201,168,124,0.2)',
  borderRadius: 20,
  textAlign: 'center',
}

const eventIconStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  marginBottom: 12,
}