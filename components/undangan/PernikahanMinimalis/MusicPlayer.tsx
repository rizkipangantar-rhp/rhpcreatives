'use client'
import { useEffect, useRef, useState } from 'react'

export default function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.4
    audio.loop = true
    // Autoplay on first user interaction
    const tryPlay = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {})
      window.removeEventListener('click', tryPlay)
      window.removeEventListener('touchstart', tryPlay)
    }
    window.addEventListener('click', tryPlay, { once: true })
    window.addEventListener('touchstart', tryPlay, { once: true })
    return () => {
      window.removeEventListener('click', tryPlay)
      window.removeEventListener('touchstart', tryPlay)
    }
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  return (
    <>
      <audio ref={audioRef} src={src} preload="none" />
      <button
        onClick={toggle}
        title={playing ? 'Pause musik' : 'Play musik'}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 50,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(201,168,124,0.9)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          transition: 'transform 0.2s',
        }}
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
    </>
  )
}