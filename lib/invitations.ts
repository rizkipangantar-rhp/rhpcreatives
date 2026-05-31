import { dbGet, dbSet } from '@/lib/store'

export type InvitationPackage = 'simpel' | 'aesthetic' | 'sultan'

export type RsvpEntry = {
  id: string
  guestName: string
  attendance: 'hadir' | 'tidak_hadir'
  guestCount: number
  message?: string
  submittedAt: string
}

export type Invitation = {
  id: string
  orderId?: string
  slug: string
  template: string
  package: InvitationPackage

  // All packages
  groomName: string
  brideName: string
  groomParents?: string
  brideParents?: string
  date: string        // "2025-08-10"
  time: string        // "10:00"
  venue: string
  venueAddress?: string

  // Aesthetic + Sultan
  mapsUrl?: string
  loveStory?: string
  rsvpEnabled: boolean
  countdownEnabled: boolean

  // Sultan only
  photos: string[]
  musicUrl?: string
  animationsEnabled: boolean

  // RSVP responses
  rsvpResponses: RsvpEntry[]

  isPublished: boolean
  createdAt: string
  updatedAt: string
}

type InvitationsData = { invitations: Invitation[] }

async function read(): Promise<InvitationsData> {
  return dbGet<InvitationsData>('rhp:invitations', 'invitations.json', { invitations: [] })
}

async function write(data: InvitationsData): Promise<void> {
  return dbSet('rhp:invitations', 'invitations.json', data)
}

function generateId(): string {
  return `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export async function getAllInvitations(): Promise<Invitation[]> {
  const db = await read()
  return db.invitations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getInvitationById(id: string): Promise<Invitation | undefined> {
  const db = await read()
  return db.invitations.find(i => i.id === id)
}

export async function getInvitationBySlug(template: string, slug: string): Promise<Invitation | undefined> {
  const db = await read()
  return db.invitations.find(i => i.template === template && i.slug === slug && i.isPublished)
}

export async function isSlugTaken(template: string, slug: string, excludeId?: string): Promise<boolean> {
  const db = await read()
  return db.invitations.some(i => i.template === template && i.slug === slug && i.id !== excludeId)
}

export async function createInvitation(
  data: Omit<Invitation, 'id' | 'rsvpResponses' | 'createdAt' | 'updatedAt'>
): Promise<Invitation> {
  const db = await read()
  const inv: Invitation = {
    ...data,
    id: generateId(),
    rsvpResponses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.invitations.push(inv)
  await write(db)
  return inv
}

export async function updateInvitation(
  id: string,
  data: Partial<Omit<Invitation, 'id' | 'createdAt'>>
): Promise<boolean> {
  const db = await read()
  const idx = db.invitations.findIndex(i => i.id === id)
  if (idx === -1) return false
  db.invitations[idx] = { ...db.invitations[idx], ...data, updatedAt: new Date().toISOString() }
  await write(db)
  return true
}

export async function deleteInvitation(id: string): Promise<boolean> {
  const db = await read()
  const before = db.invitations.length
  db.invitations = db.invitations.filter(i => i.id !== id)
  if (db.invitations.length === before) return false
  await write(db)
  return true
}

export async function addRsvpResponse(
  invitationId: string,
  entry: Omit<RsvpEntry, 'id' | 'submittedAt'>
): Promise<boolean> {
  const db = await read()
  const idx = db.invitations.findIndex(i => i.id === invitationId)
  if (idx === -1) return false
  const rsvp: RsvpEntry = {
    ...entry,
    id: `rsvp_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    submittedAt: new Date().toISOString(),
  }
  if (!db.invitations[idx].rsvpResponses) db.invitations[idx].rsvpResponses = []
  db.invitations[idx].rsvpResponses.push(rsvp)
  db.invitations[idx].updatedAt = new Date().toISOString()
  await write(db)
  return true
}