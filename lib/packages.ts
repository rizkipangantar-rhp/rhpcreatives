export type ServiceId = 'undangan' | 'landing-page' | 'desain-ig' | 'edit-foto'

export type Package = {
  id: string
  serviceId: ServiceId
  nameId: string
  nameEn: string
  price: number
  periodId: string
  periodEn: string
  delivery: string
}

export type Service = {
  id: ServiceId
  nameId: string
  nameEn: string
  icon: string
  packages: Package[]
}

export const SERVICES: Service[] = [
  {
    id: 'undangan',
    nameId: 'Undangan Online',
    nameEn: 'Online Invitation',
    icon: '💌',
    packages: [
      { id: 'undangan-simpel', serviceId: 'undangan', nameId: 'Undangan Simpel', nameEn: 'Simple Invite', price: 79000, periodId: 'per undangan', periodEn: 'per invitation', delivery: '1 hari' },
      { id: 'undangan-aesthetic', serviceId: 'undangan', nameId: 'Undangan Aesthetic', nameEn: 'Aesthetic Invite', price: 139000, periodId: 'per undangan', periodEn: 'per invitation', delivery: '2 hari' },
      { id: 'undangan-sultan', serviceId: 'undangan', nameId: 'Undangan Sultan', nameEn: 'Sultan Invite', price: 219000, periodId: 'per undangan', periodEn: 'per invitation', delivery: '3 hari' },
    ],
  },
  {
    id: 'landing-page',
    nameId: 'Landing Page',
    nameEn: 'Landing Page',
    icon: '🚀',
    packages: [
      { id: 'landing-santuy', serviceId: 'landing-page', nameId: 'Landing Page Santuy', nameEn: 'Chill Page', price: 299000, periodId: 'per halaman', periodEn: 'per page', delivery: '2 hari' },
      { id: 'landing-kece', serviceId: 'landing-page', nameId: 'Landing Page Kece', nameEn: 'Kece Page', price: 649000, periodId: 'per halaman', periodEn: 'per page', delivery: '4 hari' },
      { id: 'landing-sultan', serviceId: 'landing-page', nameId: 'Landing Page Sultan', nameEn: 'Sultan Page', price: 1099000, periodId: 'per halaman', periodEn: 'per page', delivery: '5–7 hari' },
    ],
  },
  {
    id: 'desain-ig',
    nameId: 'Desain Instagram',
    nameEn: 'Instagram Design',
    icon: '✨',
    packages: [
      { id: 'ig-satu-post', serviceId: 'desain-ig', nameId: 'Satu Post Dulu', nameEn: 'One Post First', price: 40000, periodId: 'per post', periodEn: 'per post', delivery: '1–2 hari' },
      { id: 'ig-feed-pemula', serviceId: 'desain-ig', nameId: 'Feed Pemula', nameEn: 'Starter Feed', price: 175000, periodId: 'per 5 post', periodEn: 'per 5 posts', delivery: '3–4 hari' },
      { id: 'ig-feed-aesthetic', serviceId: 'desain-ig', nameId: 'Feed Aesthetic', nameEn: 'Aesthetic Feed', price: 299000, periodId: 'per 10 post', periodEn: 'per 10 posts', delivery: '5–7 hari' },
      { id: 'ig-feed-sultan', serviceId: 'desain-ig', nameId: 'Feed Sultan', nameEn: 'Sultan Feed', price: 699000, periodId: 'per bulan', periodEn: 'per month', delivery: 'Ongoing' },
    ],
  },
  {
    id: 'edit-foto',
    nameId: 'Edit Foto',
    nameEn: 'Photo Edit',
    icon: '📸',
    packages: [
      { id: 'foto-poles-dikit', serviceId: 'edit-foto', nameId: 'Poles Dikit', nameEn: 'Quick Polish', price: 20000, periodId: 'per foto', periodEn: 'per photo', delivery: '1 hari' },
      { id: 'foto-poles-banyak', serviceId: 'edit-foto', nameId: 'Poles Banyak', nameEn: 'Full Polish', price: 75000, periodId: 'per 5 foto', periodEn: 'per 5 photos', delivery: '2–3 hari' },
      { id: 'foto-poles-abis', serviceId: 'edit-foto', nameId: 'Poles Abis', nameEn: 'Max Polish', price: 130000, periodId: 'per 10 foto', periodEn: 'per 10 photos', delivery: '3–5 hari' },
    ],
  },
]

export function findPackageById(id: string): Package | undefined {
  return SERVICES.flatMap(s => s.packages).find(p => p.id === id)
}

export function findServiceById(id: string): Service | undefined {
  return SERVICES.find(s => s.id === id)
}

export function formatPrice(price: number): string {
  return `Rp${price.toLocaleString('id-ID')}`
}
