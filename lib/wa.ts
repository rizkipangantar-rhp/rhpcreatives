export function normalizeWa(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (digits.startsWith('0')) return '62' + digits.slice(1)
  if (digits.startsWith('62')) return digits
  return '62' + digits
}

export function formatWaDisplay(wa: string): string {
  const digits = wa.replace(/\D/g, '')
  if (!digits.startsWith('62') || digits.length < 10) return wa
  const local = digits.slice(2)
  if (local.length <= 7) return `+62 ${local}`
  return `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7)}`
}

export function isValidWa(input: string): boolean {
  const normalized = normalizeWa(input)
  if (!normalized.startsWith('62')) return false
  const local = normalized.slice(2)
  return local.length >= 8 && local.length <= 13
}
