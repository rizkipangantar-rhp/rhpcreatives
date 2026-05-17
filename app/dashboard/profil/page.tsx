import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProfilCard from './ProfilCard'

export const metadata = {
  title: 'Profil — RHP Creatives',
}

export default async function ProfilPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/dashboard/profil')
  return <ProfilCard session={session} />
}
