import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import CustomRequestForm from './CustomRequestForm'

export const metadata = { title: 'Custom Order — RHP Creatives' }

export default async function CustomOrderPage() {
  const session = await getServerSession(authOptions)
  return <CustomRequestForm session={session} />
}
