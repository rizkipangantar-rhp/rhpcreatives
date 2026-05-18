export function generateReferralCode(email: string): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i)
    hash |= 0
  }
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  let n = Math.abs(hash)
  for (let i = 0; i < 5; i++) {
    code += chars[n % chars.length]
    n = Math.floor(n / chars.length)
  }
  return `RHP-${code}`
}
