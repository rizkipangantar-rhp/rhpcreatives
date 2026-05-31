'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function PhotoGallery({ photos }: { photos: string[] }) {
  const [active, setActive] = useState<string | null>(null)

  if (!photos.length) return null

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 8,
      }}>
        {photos.slice(0, 10).map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(src)}
            style={{
              padding: 0, border: 'none', background: 'none', cursor: 'pointer',
              borderRadius: 12, overflow: 'hidden',
              aspectRatio: '1', position: 'relative',
            }}
          >
            <Image
              src={src}
              alt={`Foto ${i + 1}`}
              fill
              style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')}
              onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          onClick={() => setActive(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: 24,
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active} alt="Preview" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 16, objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </>
  )
}