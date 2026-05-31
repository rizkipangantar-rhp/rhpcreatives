import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getInvitationBySlug } from '@/lib/invitations'
import PernikahanMinimalis from '@/components/undangan/PernikahanMinimalis'

type Props = {
  params: { slug: string }
  searchParams: { tamu?: string }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const inv = await getInvitationBySlug('pernikahan-minimalis', params.slug)
  if (!inv) return { title: 'Undangan Tidak Ditemukan' }

  const guestName = searchParams.tamu ? decodeURIComponent(searchParams.tamu) : undefined

  return {
    title: `Undangan Pernikahan ${inv.groomName} & ${inv.brideName}`,
    description: `${guestName ? `Kepada ${guestName}, ` : ''}Kami mengundang Anda untuk hadir di pernikahan kami pada ${inv.date} di ${inv.venue}.`,
    robots: { index: false, follow: false },
  }
}

export default async function PernikahanMinimalisPage({ params, searchParams }: Props) {
  const inv = await getInvitationBySlug('pernikahan-minimalis', params.slug)
  if (!inv) notFound()

  const guestName = searchParams.tamu ? decodeURIComponent(searchParams.tamu) : undefined

  return <PernikahanMinimalis inv={inv} guestName={guestName} />
}