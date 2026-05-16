import { Suspense } from 'react'
import LoginCard from './LoginCard'

export const metadata = {
  title: 'Login — RHP Creatives',
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <LoginCard />
    </Suspense>
  )
}
