const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateRandomReferralCode(): string {
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return `RHP-${code}`
}

// Hash-based generation kept for backward compatibility with users created before stored codes.
export function generateReferralCode(email: string): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i)
    hash |= 0
  }
  let code = ''
  let n = Math.abs(hash)
  for (let i = 0; i < 5; i++) {
    code += CHARS[n % CHARS.length]
    n = Math.floor(n / CHARS.length)
  }
  return `RHP-${code}`
}
