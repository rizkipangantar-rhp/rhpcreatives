'use client'
import { useEffect } from 'react'

function resizeTextarea(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

export default function TextareaAutoResize() {
  useEffect(() => {
    function onInput(e: Event) {
      if (e.target instanceof HTMLTextAreaElement) resizeTextarea(e.target)
    }
    // Resize all existing textareas on mount
    document.querySelectorAll('textarea').forEach(el => resizeTextarea(el as HTMLTextAreaElement))
    document.addEventListener('input', onInput)
    return () => document.removeEventListener('input', onInput)
  }, [])

  return null
}
