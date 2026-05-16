export type Lang = 'id' | 'en'

type ServiceItem = {
  num: string
  name: string
  desc: string
  features: string[]
}

type TestimonialItem = {
  initials: string
  name: string
  role: string
  text: string
}

type PageHeroContent = { label: string; title: string; sub: string }
type WhyItem = { title: string; desc: string }
type StatItem = { num: string; label: string }

type PricingTier = {
  name: string
  price: string
  period: string
  features: string[]
  delivery: string
  highlighted?: boolean
  isCustom?: boolean
  save?: string
}

type PricingServiceGroup = {
  name: string
  tiers: PricingTier[]
  revisiNote?: string
  consultNote?: string
}

type BundleItem = {
  name: string
  includes: string
  price: string
  originalPrice: string
  save: string
}

type AffiliateTier = {
  name: string
  range: string
  commission: string
}

export type Tr = {
  nav: {
    home: string
    layananDigital: string
    layananDesain: string
    testimoni: string
    promo: string
    about: string
    cta: string
  }
  hero: {
    tag: string
    titleBefore: string
    titleEm: string
    titleAfter: string
    sub: string
    cta1: string
    cta2: string
    stat1Label: string
    stat2Label: string
    stat3Label: string
    cardDesc: string
    cardPrice: string
    cardBadge: string
    cardSatisfaction: string
  }
  pageHero: {
    layananDigital: PageHeroContent
    layananDesain: PageHeroContent
    testimoni: PageHeroContent
    promo: PageHeroContent
    about: PageHeroContent
  }
  homeOverview: {
    label: string
    title: string
    sub: string
    digitalTitle: string
    digitalSub: string
    digitalItems: string[]
    digitalCta: string
    designTitle: string
    designSub: string
    designItems: string[]
    designCta: string
  }
  services: {
    label: string
    title: string
    sub: string
    headerCta: string
    digitalLabel: string
    designLabel: string
    digital: ServiceItem[]
    design: ServiceItem[]
  }
  pricing: {
    label: string
    title: string
    sub: string
    digitalLabel: string
    designLabel: string
    note: string
    popularBadge: string
    orderCta: string
    consultCta: string
    digital: PricingServiceGroup[]
    design: PricingServiceGroup[]
  }
  testimonials: {
    label: string
    title: string
    sub: string
    items: TestimonialItem[]
  }
  cta: { label: string; title: string; sub: string; trust: string[] }
  footer: { tagline: string; copy: string }
  about: {
    profileLabel: string
    profileTitle: string
    profileText: string
    visionTitle: string
    visionText: string
    missionTitle: string
    missionText: string
    whyLabel: string
    whyTitle: string
    whyItems: WhyItem[]
    statsLabel: string
    stats: StatItem[]
  }
  promo: {
    earlyBird: {
      label: string
      title: string
      discount: string
      quota: string
      dp: string
      desc: string
      badge: string
      cta: string
    }
    bundling: {
      label: string
      title: string
      sub: string
      savingsLabel: string
      items: BundleItem[]
      cta: string
    }
    referral: {
      label: string
      title: string
      sub: string
      referrerTitle: string
      referrerDiscount: string
      referrerDesc: string
      inviteeTitle: string
      inviteeDiscount: string
      inviteeDesc: string
      howTitle: string
      steps: string[]
      cta: string
    }
    affiliate: {
      label: string
      title: string
      sub: string
      tiers: AffiliateTier[]
      payoutMin: string
      payoutDate: string
      benefitLabel: string
      benefits: string[]
      cta: string
    }
  }
}

export const t: Record<Lang, Tr> = {
  id: {
    nav: {
      home: 'Beranda',
      layananDigital: 'Layanan Digital',
      layananDesain: 'Layanan Desain',
      testimoni: 'Testimoni',
      promo: 'Promo',
      about: 'Tentang',
      cta: 'Order Sekarang →',
    },
    hero: {
      tag: '✦ Jasa Digital & Desain Kreatif',
      titleBefore: 'Wujudkan Kehadiran ',
      titleEm: 'Digital',
      titleAfter: 'yang Berkesan',
      sub: 'RHP Creatives hadir untuk membantu Anda tampil profesional di dunia digital — dari undangan online, landing page, website, hingga desain grafis berkualitas.',
      cta1: 'Mulai Proyek ↗',
      cta2: 'Lihat Layanan →',
      stat1Label: 'Layanan Tersedia',
      stat2Label: 'Pengerjaan Cepat',
      stat3Label: 'Revisi Inklusif',
      cardDesc: 'Undangan Online · Landing Page · Website · Desain Instagram · Edit Foto · Desain Branding',
      cardPrice: 'Mulai Rp20.000',
      cardBadge: '⚡ Early Bird Diskon 25%',
      cardSatisfaction: 'Kepuasan Klien #1',
    },
    pageHero: {
      layananDigital: {
        label: 'Layanan Digital',
        title: 'Solusi Digital untuk Bisnis Anda',
        sub: 'Dari undangan online hingga website profesional — kami hadir untuk membantu Anda tampil terbaik di dunia digital.',
      },
      layananDesain: {
        label: 'Layanan Desain',
        title: 'Desain Grafis yang Memukau',
        sub: 'Konten visual berkualitas untuk Instagram, editing foto profesional, dan branding visual yang berkesan.',
      },
      testimoni: {
        label: 'Testimoni',
        title: 'Apa Kata Klien Kami',
        sub: 'Kepuasan klien adalah prioritas utama. Simak pengalaman nyata mereka bersama RHP Creatives.',
      },
      promo: {
        label: 'Promo & Penawaran',
        title: 'Penawaran Spesial RHP Creatives',
        sub: 'Hemat lebih banyak dengan Early Bird, Paket Bundling, Program Referral, dan Affiliate kami.',
      },
      about: {
        label: 'Tentang Kami',
        title: 'Kenali RHP Creatives',
        sub: 'Tim kreatif muda yang berdedikasi untuk membantu bisnis dan personal tampil profesional di era digital.',
      },
    },
    homeOverview: {
      label: 'Layanan Kami',
      title: 'Apa yang Bisa Kami Lakukan?',
      sub: 'Dua kategori layanan lengkap untuk memenuhi semua kebutuhan digital dan desain Anda.',
      digitalTitle: 'Layanan Digital',
      digitalSub: 'Undangan online, landing page, dan website profesional untuk kehadiran digital yang kuat.',
      digitalItems: ['Undangan Online', 'Landing Page', 'Website Profesional'],
      digitalCta: 'Lihat Detail & Harga →',
      designTitle: 'Layanan Desain',
      designSub: 'Desain grafis berkualitas untuk konten Instagram, editing foto profesional, dan branding visual.',
      designItems: ['Desain Instagram', 'Edit Foto', 'Desain Branding'],
      designCta: 'Lihat Detail & Harga →',
    },
    services: {
      label: 'Apa yang Kami Kerjakan',
      title: 'Layanan RHP Creatives',
      sub: 'Solusi digital dan desain kreatif untuk tampil profesional di era digital.',
      headerCta: 'Konsultasi Gratis ↗',
      digitalLabel: '✦ Layanan Digital',
      designLabel: '✦ Layanan Desain',
      digital: [
        {
          num: '01',
          name: 'Undangan Online',
          desc: 'Undangan pernikahan, ulang tahun, dan acara spesial dalam format digital yang elegan dan mudah dibagikan — tersedia pilihan Basic hingga Premium.',
          features: ['Desain custom & personal', 'RSVP & countdown timer', 'Peta lokasi & galeri foto'],
        },
        {
          num: '02',
          name: 'Landing Page',
          desc: 'Halaman promosi satu halaman yang fokus pada konversi — cocok untuk produk, event, atau kampanye bisnis Anda.',
          features: ['Desain modern & persuasif', 'Mobile-first responsive', 'Tombol WhatsApp / CTA'],
        },
        {
          num: '03',
          name: 'Website',
          desc: 'Website profesional multi-halaman untuk bisnis, portofolio, atau toko online yang merepresentasikan brand Anda secara penuh.',
          features: ['Company profile / toko online', 'SEO ready & cepat', 'CMS mudah dikelola'],
        },
      ],
      design: [
        {
          num: '04',
          name: 'Desain Instagram',
          desc: 'Feed, story, dan highlight cover yang konsisten, estetis, dan sesuai identitas brand — tersedia per post hingga paket bulanan.',
          features: ['Feed, story & highlight', 'Konsisten dengan branding', 'Format siap upload'],
        },
        {
          num: '05',
          name: 'Edit Foto',
          desc: 'Editing foto profesional untuk produk, portrait, atau konten media sosial — retouch, color grading, dan background removal.',
          features: ['Retouch & color grading', 'Remove background', 'Output resolusi tinggi'],
        },
        {
          num: '06',
          name: 'Desain Branding',
          desc: 'Identitas visual yang kuat untuk bisnis Anda — dari logo profesional hingga panduan brand lengkap yang konsisten dan berkesan.',
          features: ['Konsep logo custom', 'Color palette & typography', 'Brand guide & aset visual'],
        },
      ],
    },
    pricing: {
      label: 'Harga Transparan',
      title: 'Paket & Harga Layanan',
      sub: 'Harga dapat disesuaikan dengan kebutuhan proyek. Hubungi kami untuk penawaran terbaik.',
      digitalLabel: '✦ Layanan Digital',
      designLabel: '✦ Layanan Desain',
      note: '* Semua harga bersifat estimasi. Konsultasikan kebutuhan Anda untuk harga final.',
      popularBadge: 'Terpopuler',
      orderCta: 'Pesan Sekarang →',
      consultCta: 'Konsultasi →',
      digital: [
        {
          name: 'Undangan Online',
          tiers: [
            {
              name: 'Basic',
              price: 'Rp79.000',
              period: 'per undangan',
              delivery: '1 hari',
              features: ['Desain template pilihan', 'Info acara lengkap', 'Link undangan personal'],
            },
            {
              name: 'Standard',
              price: 'Rp139.000',
              period: 'per undangan',
              delivery: '2 hari',
              highlighted: true,
              features: ['Semua fitur Basic', 'Form RSVP online', 'Countdown timer', 'Peta lokasi Google Maps', 'Revisi 1x'],
            },
            {
              name: 'Premium',
              price: 'Rp219.000',
              period: 'per undangan',
              delivery: '3 hari',
              features: ['Semua fitur Standard', 'Galeri foto', 'Musik latar', 'Efek animasi', 'Revisi 2x'],
            },
          ],
          revisiNote: 'Revisi di luar paket: Rp35.000/revisi',
        },
        {
          name: 'Landing Page',
          tiers: [
            {
              name: 'Basic',
              price: 'Rp299.000',
              period: 'per halaman',
              delivery: '2 hari',
              features: ['1 halaman desain', 'Tampilan clean & modern', 'Tombol WhatsApp', 'Mobile-friendly'],
            },
            {
              name: 'Standard',
              price: 'Rp649.000',
              period: 'per halaman',
              delivery: '4 hari',
              highlighted: true,
              features: ['Semua fitur Basic', 'Form kontak', 'Full mobile responsive', 'Revisi 2x'],
            },
            {
              name: 'Premium',
              price: 'Rp1.099.000',
              period: 'per halaman',
              delivery: '5-7 hari',
              features: ['Semua fitur Standard', 'Animasi & transisi', 'SEO dasar', 'Revisi 3x'],
            },
          ],
          revisiNote: 'Revisi di luar paket: Rp50.000/revisi',
        },
        {
          name: 'Website',
          tiers: [
            {
              name: 'Starter',
              price: 'Rp1.500.000',
              period: 'mulai dari',
              delivery: '7 hari',
              features: ['3-4 halaman', 'Desain responsif', 'Setup hosting', 'Revisi 1x'],
            },
            {
              name: 'Standard',
              price: 'Rp2.800.000',
              period: 'mulai dari',
              delivery: '10-14 hari',
              highlighted: true,
              features: ['5-7 halaman', 'Desain custom', 'CMS dashboard', 'Revisi 3x'],
            },
            {
              name: 'Premium',
              price: 'Rp5.500.000',
              period: 'mulai dari',
              delivery: '14-21 hari',
              features: ['8-10 halaman', 'Full custom design', 'SEO optimasi', 'Domain & hosting 1 tahun', 'Revisi 5x'],
            },
            {
              name: 'Custom',
              price: 'Hubungi Kami',
              period: 'sesuai kebutuhan',
              delivery: 'sesuai scope',
              isCustom: true,
              features: ['Kebutuhan khusus', 'Konsultasi mendalam', 'Tim teknis berpengalaman', 'Scope fleksibel'],
            },
          ],
          revisiNote: 'Revisi di luar paket: Rp75.000/revisi',
          consultNote: '💡 Wajib konsultasi terlebih dahulu sebelum memesan.',
        },
      ],
      design: [
        {
          name: 'Desain Instagram',
          tiers: [
            {
              name: 'Basic',
              price: 'Rp40.000',
              period: 'per post',
              delivery: '1-2 hari',
              features: ['1 konten feed atau story', 'Revisi 1x'],
            },
            {
              name: 'Bundle 5',
              price: 'Rp175.000',
              period: 'per 5 post',
              delivery: '3-4 hari',
              save: 'Hemat Rp25.000',
              features: ['5 konten feed & story', 'Revisi 1x per konten'],
            },
            {
              name: 'Bundle 10',
              price: 'Rp299.000',
              period: 'per 10 post',
              delivery: '5-7 hari',
              highlighted: true,
              save: 'Hemat Rp101.000',
              features: ['10 konten feed & story', 'Revisi 1x per konten', 'Prioritas antrian'],
            },
            {
              name: 'Bulanan',
              price: 'Rp699.000',
              period: 'per bulan',
              delivery: 'Ongoing',
              features: ['20 desain per bulan', 'Feed & story', 'Revisi 1x per konten', 'Branding konsisten', 'Prioritas antrian'],
            },
          ],
        },
        {
          name: 'Edit Foto',
          tiers: [
            {
              name: 'Basic',
              price: 'Rp20.000',
              period: 'per foto',
              delivery: '1 hari',
              features: ['Retouch & color grading', 'Output JPG/PNG', 'Revisi 1x'],
            },
            {
              name: 'Bundle 5',
              price: 'Rp75.000',
              period: 'per 5 foto',
              delivery: '2-3 hari',
              features: ['5 foto', 'Retouch & color grading', 'Resolusi tinggi', 'Revisi 1x/foto'],
            },
            {
              name: 'Bundle 10',
              price: 'Rp130.000',
              period: 'per 10 foto',
              delivery: '3-5 hari',
              highlighted: true,
              features: ['10 foto', 'Retouch & color grading', 'Background removal', 'Resolusi tinggi', 'Revisi 1x/foto'],
            },
          ],
          revisiNote: 'Revisi di luar paket: Rp15.000/revisi',
        },
        {
          name: 'Desain Branding',
          tiers: [
            {
              name: 'Basic',
              price: 'Rp399.000',
              period: 'paket lengkap',
              delivery: '3-4 hari',
              features: ['3 konsep logo', 'Format PNG & JPG', 'Revisi 2x'],
            },
            {
              name: 'Standard',
              price: 'Rp850.000',
              period: 'paket lengkap',
              delivery: '5-7 hari',
              highlighted: true,
              features: ['Logo final', 'Color palette', 'Typography guide', 'Format AI/SVG/PNG', 'Revisi 3x'],
            },
            {
              name: 'Premium',
              price: 'Rp2.200.000',
              period: 'paket lengkap',
              delivery: '10-14 hari',
              features: ['Semua fitur Standard', 'Desain kartu nama', 'Kop surat', 'Brand guide lengkap', 'Revisi 5x'],
            },
          ],
          revisiNote: 'Revisi di luar paket: Rp50.000/revisi',
        },
      ],
    },
    testimonials: {
      label: 'Kata Klien Kami',
      title: 'Mereka Sudah Merasakannya',
      sub: 'Kepercayaan klien adalah prioritas utama RHP Creatives.',
      items: [
        {
          initials: 'NA',
          name: 'Nadia Aulia',
          role: 'Pengantin, Undangan Online',
          text: 'Undangan online-nya cantik banget! Banyak tamu yang compliment desainnya. Prosesnya cepat, revisi dilayani dengan sabar. Pokoknya rekomen banget!',
        },
        {
          initials: 'RP',
          name: 'Rizal Pratama',
          role: 'Owner, RP Clothing',
          text: 'Landing page yang dibuat RHP Creatives beneran ngaruh ke penjualan. Tampilannya profesional dan tombol WA-nya langsung banyak yang klik. Worth it!',
        },
        {
          initials: 'DS',
          name: 'Dina Sari',
          role: 'UMKM Kuliner',
          text: 'Feed Instagram saya jadi jauh lebih estetis dan konsisten. Banyak pelanggan yang DM nanya beli di mana setelah lihat konten yang sudah didesain RHP.',
        },
        {
          initials: 'AF',
          name: 'Andi Firmansyah',
          role: 'Event Organizer',
          text: 'Flyer dan banner event kami selalu dikerjakan RHP Creatives. Hasilnya selalu keren, pengerjaan cepat, dan harganya sangat masuk akal.',
        },
        {
          initials: 'MR',
          name: 'Maya Rahayu',
          role: 'Fotografer',
          text: 'Jasa edit foto-nya rapi dan natural banget. Warna foto saya jadi lebih hidup tanpa terlihat over-edited. Langsung jadi langganan tetap!',
        },
        {
          initials: 'BN',
          name: 'Bagas Nugroho',
          role: 'Startup Founder',
          text: 'Website company profile kami selesai tepat waktu dan hasilnya melebihi ekspektasi. Responsif di semua device dan loading-nya cepat. Sangat puas!',
        },
      ],
    },
    cta: {
      label: 'Mulai Sekarang',
      title: 'Siap Tampil Profesional di Dunia Digital?',
      sub: 'Konsultasi gratis, tanpa komitmen. Ceritakan kebutuhan Anda dan kami siapkan solusinya dengan cepat.',
      trust: ['Kualitas Terjamin', 'Pengerjaan Cepat', 'Revisi Inklusif', 'Harga Transparan'],
    },
    footer: {
      tagline: 'Jasa Digital & Desain Kreatif Profesional',
      copy: '© 2026 RHP Creatives. Hak cipta dilindungi.',
    },
    about: {
      profileLabel: 'Profil',
      profileTitle: 'RHP Creatives',
      profileText:
        'RHP Creatives adalah jasa kreatif digital yang berfokus pada layanan desain dan digital. Kami hadir untuk membantu individu, UMKM, dan bisnis tampil profesional dan berkesan di dunia digital. Dengan pendekatan personal dan harga yang terjangkau, kami percaya bahwa setiap orang berhak tampil terbaik.',
      visionTitle: 'Visi',
      visionText:
        'Menjadi mitra kreatif digital terpercaya yang membantu bisnis dan personal Indonesia tampil profesional dan kompetitif di era digital.',
      missionTitle: 'Misi',
      missionText:
        'Memberikan layanan digital dan desain berkualitas tinggi dengan harga terjangkau, pengerjaan cepat, dan pelayanan yang ramah — sehingga setiap klien merasa puas dan terlayani dengan baik.',
      whyLabel: 'Keunggulan',
      whyTitle: 'Kenapa Pilih Kami?',
      whyItems: [
        { title: 'Harga Terjangkau', desc: 'Paket harga transparan yang cocok untuk semua kalangan — mulai UMKM hingga perusahaan.' },
        { title: 'Pengerjaan Cepat', desc: 'Kami menghargai waktu Anda. Setiap proyek dikerjakan efisien tanpa mengorbankan kualitas.' },
        { title: 'Revisi Inklusif', desc: 'Kepuasan Anda prioritas kami. Revisi sudah termasuk dalam setiap paket layanan.' },
        { title: 'Komunikasi Responsif', desc: 'Tim kami selalu siap merespons pertanyaan dan kebutuhan Anda dengan cepat dan ramah.' },
        { title: 'Desain Custom', desc: 'Tidak ada template generik. Setiap proyek dikerjakan sesuai kebutuhan dan identitas unik Anda.' },
        { title: 'Kualitas Terjamin', desc: 'Setiap output melewati proses quality check untuk memastikan hasil terbaik.' },
      ],
      statsLabel: 'Dalam Angka',
      stats: [
        { num: '6+', label: 'Layanan Tersedia' },
        { num: '50+', label: 'Klien Terlayani' },
        { num: '100%', label: 'Kepuasan Klien' },
        { num: '24 Jam', label: 'Waktu Respons' },
      ],
    },
    promo: {
      earlyBird: {
        label: 'Penawaran Terbatas',
        title: 'Early Bird Spesial',
        discount: '25%',
        quota: '20 Klien Pertama',
        dp: 'DP 50%',
        desc: 'Dapatkan diskon 25% untuk semua layanan. Hanya untuk 20 klien pertama yang mendaftar. DP minimal 50% saat konfirmasi order.',
        badge: 'PROMO AKTIF',
        cta: 'Klaim Diskon Sekarang →',
      },
      bundling: {
        label: 'Hemat Lebih Banyak',
        title: 'Paket Bundling',
        sub: 'Gabungkan beberapa layanan dan hemat lebih banyak. Pilih paket yang sesuai kebutuhanmu.',
        savingsLabel: 'hemat',
        items: [
          {
            name: 'Starter Pack',
            includes: 'Landing Page Basic + 3 Desain Instagram',
            price: 'Rp349.000',
            originalPrice: 'Rp419.000',
            save: 'Hemat Rp70.000',
          },
          {
            name: 'Brand Pack',
            includes: 'Branding Basic + Edit Foto Bundle 5',
            price: 'Rp399.000',
            originalPrice: 'Rp474.000',
            save: 'Hemat Rp75.000',
          },
          {
            name: 'Digital Pack',
            includes: 'Landing Page Standard + Branding Basic',
            price: 'Rp899.000',
            originalPrice: 'Rp1.048.000',
            save: 'Hemat Rp149.000',
          },
          {
            name: 'Full Pack',
            includes: 'Website Starter + Branding Standard + Bundle 10 Instagram',
            price: 'Rp2.199.000',
            originalPrice: 'Rp2.649.000',
            save: 'Hemat Rp450.000',
          },
        ],
        cta: 'Pesan Paket Bundling →',
      },
      referral: {
        label: 'Ajak & Dapatkan Bonus',
        title: 'Program Referral',
        sub: 'Rekomendasikan RHP Creatives ke teman dan dapatkan diskon untuk order berikutnya.',
        referrerTitle: 'Kamu yang Mengajak',
        referrerDiscount: '15%',
        referrerDesc: 'Dapatkan diskon 15% untuk order berikutnya setiap kali temanmu melakukan order pertama melalui referral kamu.',
        inviteeTitle: 'Teman yang Diajak',
        inviteeDiscount: '10%',
        inviteeDesc: 'Teman yang kamu ajak mendapatkan diskon 10% untuk order pertama mereka di RHP Creatives.',
        howTitle: 'Cara Kerja',
        steps: [
          'Hubungi kami dan minta kode referral unikmu',
          'Bagikan kode ke teman yang membutuhkan jasa kami',
          'Temanmu order menggunakan kode referral',
          'Diskon otomatis berlaku untuk kalian berdua',
        ],
        cta: 'Minta Kode Referral →',
      },
      affiliate: {
        label: 'Cuan Bareng RHP',
        title: 'Program Affiliate',
        sub: 'Bergabunglah sebagai affiliate RHP Creatives dan dapatkan komisi untuk setiap klien yang kamu rekomendasikan.',
        tiers: [
          { name: 'Starter', range: '1–4 referral', commission: 'Komisi 5%' },
          { name: 'Growth', range: '5–14 referral', commission: 'Komisi 7%' },
          { name: 'Pro', range: '15+ referral', commission: 'Komisi 10%' },
        ],
        payoutMin: 'Rp50.000',
        payoutDate: 'Tanggal 1 & 15 setiap bulan',
        benefitLabel: 'Keuntungan Affiliate',
        benefits: [
          'Komisi per layanan yang berhasil',
          'Dashboard tracking real-time',
          'Pencairan minimum Rp50.000',
          'Pembayaran tanggal 1 & 15 tiap bulan',
          'Support materi promosi',
        ],
        cta: 'Daftar Affiliate Sekarang →',
      },
    },
  },

  en: {
    nav: {
      home: 'Home',
      layananDigital: 'Digital Services',
      layananDesain: 'Design Services',
      testimoni: 'Testimonials',
      promo: 'Promo',
      about: 'About',
      cta: 'Order Now →',
    },
    hero: {
      tag: '✦ Digital & Creative Design Services',
      titleBefore: 'Build a Memorable ',
      titleEm: 'Digital',
      titleAfter: 'Presence',
      sub: 'RHP Creatives is here to help you stand out professionally in the digital world — from online invitations and landing pages to full websites and quality graphic design.',
      cta1: 'Start Project ↗',
      cta2: 'View Services →',
      stat1Label: 'Services Available',
      stat2Label: 'Fast Delivery',
      stat3Label: 'Revisions Included',
      cardDesc: 'Online Invitation · Landing Page · Website · Instagram Design · Photo Edit · Brand Design',
      cardPrice: 'Starting from Rp20.000',
      cardBadge: '⚡ Early Bird 25% Off',
      cardSatisfaction: 'Client Satisfaction #1',
    },
    pageHero: {
      layananDigital: {
        label: 'Digital Services',
        title: 'Digital Solutions for Your Business',
        sub: 'From online invitations to professional websites — we help you put your best foot forward in the digital world.',
      },
      layananDesain: {
        label: 'Design Services',
        title: 'Stunning Graphic Design',
        sub: 'Quality visual content for Instagram, professional photo editing, and memorable visual branding.',
      },
      testimoni: {
        label: 'Testimonials',
        title: 'What Our Clients Say',
        sub: 'Client satisfaction is our top priority. Read their real experiences with RHP Creatives.',
      },
      promo: {
        label: 'Promos & Deals',
        title: 'Special Offers from RHP Creatives',
        sub: 'Save more with our Early Bird discount, Bundle Packages, Referral Program, and Affiliate Program.',
      },
      about: {
        label: 'About Us',
        title: 'Meet RHP Creatives',
        sub: 'A dedicated young creative team helping businesses and individuals look professional in the digital age.',
      },
    },
    homeOverview: {
      label: 'Our Services',
      title: 'What Can We Do for You?',
      sub: 'Two complete service categories to cover all your digital and design needs.',
      digitalTitle: 'Digital Services',
      digitalSub: 'Online invitations, landing pages, and professional websites for a strong digital presence.',
      digitalItems: ['Online Invitation', 'Landing Page', 'Professional Website'],
      digitalCta: 'View Details & Pricing →',
      designTitle: 'Design Services',
      designSub: 'Quality graphic design for Instagram content, professional photo editing, and visual branding.',
      designItems: ['Instagram Design', 'Photo Editing', 'Brand Design'],
      designCta: 'View Details & Pricing →',
    },
    services: {
      label: 'What We Do',
      title: 'RHP Creatives Services',
      sub: 'Digital and creative design solutions to help you look professional in the digital era.',
      headerCta: 'Free Consultation ↗',
      digitalLabel: '✦ Digital Services',
      designLabel: '✦ Design Services',
      digital: [
        {
          num: '01',
          name: 'Online Invitation',
          desc: 'Wedding, birthday, and special event invitations in an elegant digital format that is easy to share — available in Basic to Premium plans.',
          features: ['Custom & personal design', 'RSVP & countdown timer', 'Location map & photo gallery'],
        },
        {
          num: '02',
          name: 'Landing Page',
          desc: 'A single-page promotion focused on conversion — ideal for products, events, or your business campaigns.',
          features: ['Modern & persuasive design', 'Mobile-first responsive', 'WhatsApp / CTA button'],
        },
        {
          num: '03',
          name: 'Website',
          desc: 'Professional multi-page websites for businesses, portfolios, or online stores that fully represent your brand.',
          features: ['Company profile / online store', 'SEO ready & fast', 'Easy-to-manage CMS'],
        },
      ],
      design: [
        {
          num: '04',
          name: 'Instagram Design',
          desc: 'Consistent, aesthetic feed, story, and highlight covers aligned with your brand — available per post or monthly packages.',
          features: ['Feed, story & highlight', 'Consistent with branding', 'Upload-ready format'],
        },
        {
          num: '05',
          name: 'Photo Editing',
          desc: 'Professional photo editing for products, portraits, or social media — retouching, color grading, and background removal.',
          features: ['Retouch & color grading', 'Background removal', 'High-resolution output'],
        },
        {
          num: '06',
          name: 'Brand Design',
          desc: 'A strong visual identity for your business — from a professional logo to a complete brand guide that is consistent and memorable.',
          features: ['Custom logo concepts', 'Color palette & typography', 'Brand guide & visual assets'],
        },
      ],
    },
    pricing: {
      label: 'Transparent Pricing',
      title: 'Service Packages & Pricing',
      sub: 'Prices may be adjusted based on project needs. Contact us for the best offer.',
      digitalLabel: '✦ Digital Services',
      designLabel: '✦ Design Services',
      note: '* All prices are estimates. Discuss your needs for a final quote.',
      popularBadge: 'Most Popular',
      orderCta: 'Order Now →',
      consultCta: 'Consult →',
      digital: [
        {
          name: 'Online Invitation',
          tiers: [
            {
              name: 'Basic',
              price: 'Rp79.000',
              period: 'per invitation',
              delivery: '1 day',
              features: ['Template design', 'Full event info', 'Personal invitation link'],
            },
            {
              name: 'Standard',
              price: 'Rp139.000',
              period: 'per invitation',
              delivery: '2 days',
              highlighted: true,
              features: ['All Basic features', 'Online RSVP form', 'Countdown timer', 'Google Maps location', '1x revision'],
            },
            {
              name: 'Premium',
              price: 'Rp219.000',
              period: 'per invitation',
              delivery: '3 days',
              features: ['All Standard features', 'Photo gallery', 'Background music', 'Animation effects', '2x revisions'],
            },
          ],
          revisiNote: 'Extra revision: Rp35.000/revision',
        },
        {
          name: 'Landing Page',
          tiers: [
            {
              name: 'Basic',
              price: 'Rp299.000',
              period: 'per page',
              delivery: '2 days',
              features: ['1-page design', 'Clean & modern look', 'WhatsApp button', 'Mobile-friendly'],
            },
            {
              name: 'Standard',
              price: 'Rp649.000',
              period: 'per page',
              delivery: '4 days',
              highlighted: true,
              features: ['All Basic features', 'Contact form', 'Full mobile responsive', '2x revisions'],
            },
            {
              name: 'Premium',
              price: 'Rp1.099.000',
              period: 'per page',
              delivery: '5-7 days',
              features: ['All Standard features', 'Animations & transitions', 'Basic SEO', '3x revisions'],
            },
          ],
          revisiNote: 'Extra revision: Rp50.000/revision',
        },
        {
          name: 'Website',
          tiers: [
            {
              name: 'Starter',
              price: 'Rp1.500.000',
              period: 'starting from',
              delivery: '7 days',
              features: ['3-4 pages', 'Responsive design', 'Hosting setup', '1x revision'],
            },
            {
              name: 'Standard',
              price: 'Rp2.800.000',
              period: 'starting from',
              delivery: '10-14 days',
              highlighted: true,
              features: ['5-7 pages', 'Custom design', 'CMS dashboard', '3x revisions'],
            },
            {
              name: 'Premium',
              price: 'Rp5.500.000',
              period: 'starting from',
              delivery: '14-21 days',
              features: ['8-10 pages', 'Full custom design', 'SEO optimization', 'Domain & hosting 1 year', '5x revisions'],
            },
            {
              name: 'Custom',
              price: 'Contact Us',
              period: 'as needed',
              delivery: 'per scope',
              isCustom: true,
              features: ['Special requirements', 'In-depth consultation', 'Experienced dev team', 'Flexible scope'],
            },
          ],
          revisiNote: 'Extra revision: Rp75.000/revision',
          consultNote: '💡 Consultation required before ordering.',
        },
      ],
      design: [
        {
          name: 'Instagram Design',
          tiers: [
            {
              name: 'Basic',
              price: 'Rp40.000',
              period: 'per post',
              delivery: '1-2 days',
              features: ['1 feed or story content', '1x revision'],
            },
            {
              name: 'Bundle 5',
              price: 'Rp175.000',
              period: 'per 5 posts',
              delivery: '3-4 days',
              save: 'Save Rp25.000',
              features: ['5 feed & story content', '1x revision per content'],
            },
            {
              name: 'Bundle 10',
              price: 'Rp299.000',
              period: 'per 10 posts',
              delivery: '5-7 days',
              highlighted: true,
              save: 'Save Rp101.000',
              features: ['10 feed & story content', '1x revision per content', 'Priority queue'],
            },
            {
              name: 'Monthly',
              price: 'Rp699.000',
              period: 'per month',
              delivery: 'Ongoing',
              features: ['20 designs per month', 'Feed & story', '1x revision per content', 'Consistent branding', 'Priority queue'],
            },
          ],
        },
        {
          name: 'Photo Editing',
          tiers: [
            {
              name: 'Basic',
              price: 'Rp20.000',
              period: 'per photo',
              delivery: '1 day',
              features: ['Retouch & color grading', 'JPG/PNG output', '1x revision'],
            },
            {
              name: 'Bundle 5',
              price: 'Rp75.000',
              period: 'per 5 photos',
              delivery: '2-3 days',
              features: ['5 photos', 'Retouch & color grading', 'High resolution', '1x revision/photo'],
            },
            {
              name: 'Bundle 10',
              price: 'Rp130.000',
              period: 'per 10 photos',
              delivery: '3-5 days',
              highlighted: true,
              features: ['10 photos', 'Retouch & color grading', 'Background removal', 'High resolution', '1x revision/photo'],
            },
          ],
          revisiNote: 'Extra revision: Rp15.000/revision',
        },
        {
          name: 'Brand Design',
          tiers: [
            {
              name: 'Basic',
              price: 'Rp399.000',
              period: 'full package',
              delivery: '3-4 days',
              features: ['3 logo concepts', 'PNG & JPG format', '2x revisions'],
            },
            {
              name: 'Standard',
              price: 'Rp850.000',
              period: 'full package',
              delivery: '5-7 days',
              highlighted: true,
              features: ['Final logo', 'Color palette', 'Typography guide', 'AI/SVG/PNG format', '3x revisions'],
            },
            {
              name: 'Premium',
              price: 'Rp2.200.000',
              period: 'full package',
              delivery: '10-14 days',
              features: ['All Standard features', 'Business card design', 'Letterhead', 'Full brand guide', '5x revisions'],
            },
          ],
          revisiNote: 'Extra revision: Rp50.000/revision',
        },
      ],
    },
    testimonials: {
      label: 'What Our Clients Say',
      title: "They've Experienced It",
      sub: 'Client trust is the top priority at RHP Creatives.',
      items: [
        {
          initials: 'NA',
          name: 'Nadia Aulia',
          role: 'Bride, Online Invitation',
          text: 'The online invitation was absolutely beautiful! Many guests complimented the design. The process was fast and revisions were handled patiently. Highly recommended!',
        },
        {
          initials: 'RP',
          name: 'Rizal Pratama',
          role: 'Owner, RP Clothing',
          text: 'The landing page made by RHP Creatives really boosted our sales. The look is professional and the WhatsApp button got a lot of clicks. Totally worth it!',
        },
        {
          initials: 'DS',
          name: 'Dina Sari',
          role: 'F&B SME',
          text: 'My Instagram feed looks so much more aesthetic and consistent now. Many customers DM asking where to buy after seeing the content designed by RHP.',
        },
        {
          initials: 'AF',
          name: 'Andi Firmansyah',
          role: 'Event Organizer',
          text: 'RHP Creatives always handles our event flyers and banners. The results are always great, delivered fast, and very reasonably priced.',
        },
        {
          initials: 'MR',
          name: 'Maya Rahayu',
          role: 'Photographer',
          text: 'The photo editing is clean and natural. My photos are more vibrant without looking over-edited. I am now a regular customer!',
        },
        {
          initials: 'BN',
          name: 'Bagas Nugroho',
          role: 'Startup Founder',
          text: 'Our company profile website was finished on time and exceeded expectations. Responsive on all devices and loads fast. Very satisfied!',
        },
      ],
    },
    cta: {
      label: 'Get Started',
      title: 'Ready to Look Professional Online?',
      sub: "Free consultation, no commitment. Tell us your needs and we'll prepare a solution quickly.",
      trust: ['Quality Guaranteed', 'Fast Delivery', 'Revisions Included', 'Transparent Pricing'],
    },
    footer: {
      tagline: 'Professional Digital & Creative Design Services',
      copy: '© 2026 RHP Creatives. All rights reserved.',
    },
    about: {
      profileLabel: 'Profile',
      profileTitle: 'RHP Creatives',
      profileText:
        'RHP Creatives is a digital creative service focused on design and digital solutions. We help individuals, SMEs, and businesses look professional and memorable in the digital world. With a personal approach and affordable pricing, we believe everyone deserves to look their best.',
      visionTitle: 'Vision',
      visionText:
        'To be a trusted digital creative partner that helps Indonesian businesses and individuals look professional and competitive in the digital era.',
      missionTitle: 'Mission',
      missionText:
        'To deliver high-quality digital and design services at affordable prices, with fast turnaround and friendly service — so every client feels satisfied and well-served.',
      whyLabel: 'Our Edge',
      whyTitle: 'Why Choose Us?',
      whyItems: [
        { title: 'Affordable Pricing', desc: 'Transparent pricing packages suitable for everyone — from small businesses to enterprises.' },
        { title: 'Fast Delivery', desc: "We respect your time. Every project is handled efficiently without sacrificing quality." },
        { title: 'Revisions Included', desc: 'Your satisfaction is our priority. Revisions are included in every service package.' },
        { title: 'Responsive Communication', desc: 'Our team is always ready to respond to your questions and needs quickly and warmly.' },
        { title: 'Custom Design', desc: 'No generic templates. Every project is crafted to match your unique needs and identity.' },
        { title: 'Quality Assured', desc: 'Every output goes through a quality check process to ensure the best result.' },
      ],
      statsLabel: 'By the Numbers',
      stats: [
        { num: '6+', label: 'Services Available' },
        { num: '50+', label: 'Clients Served' },
        { num: '100%', label: 'Client Satisfaction' },
        { num: '24h', label: 'Response Time' },
      ],
    },
    promo: {
      earlyBird: {
        label: 'Limited Offer',
        title: 'Early Bird Special',
        discount: '25%',
        quota: 'First 20 Clients',
        dp: 'DP 50%',
        desc: 'Get 25% off all services. Available for the first 20 clients only. Minimum 50% down payment upon order confirmation.',
        badge: 'PROMO ACTIVE',
        cta: 'Claim Discount Now →',
      },
      bundling: {
        label: 'Save Even More',
        title: 'Bundle Packages',
        sub: 'Combine multiple services and save more. Choose the package that fits your needs.',
        savingsLabel: 'save',
        items: [
          {
            name: 'Starter Pack',
            includes: 'Landing Page Basic + 3 Instagram Designs',
            price: 'Rp349.000',
            originalPrice: 'Rp419.000',
            save: 'Save Rp70.000',
          },
          {
            name: 'Brand Pack',
            includes: 'Branding Basic + Photo Edit Bundle 5',
            price: 'Rp399.000',
            originalPrice: 'Rp474.000',
            save: 'Save Rp75.000',
          },
          {
            name: 'Digital Pack',
            includes: 'Landing Page Standard + Branding Basic',
            price: 'Rp899.000',
            originalPrice: 'Rp1.048.000',
            save: 'Save Rp149.000',
          },
          {
            name: 'Full Pack',
            includes: 'Website Starter + Branding Standard + Instagram Bundle 10',
            price: 'Rp2.199.000',
            originalPrice: 'Rp2.649.000',
            save: 'Save Rp450.000',
          },
        ],
        cta: 'Order Bundle Package →',
      },
      referral: {
        label: 'Invite & Earn',
        title: 'Referral Program',
        sub: 'Recommend RHP Creatives to friends and get a discount on your next order.',
        referrerTitle: 'You (the Referrer)',
        referrerDiscount: '15%',
        referrerDesc: 'Earn a 15% discount on your next order every time a friend makes their first order through your referral.',
        inviteeTitle: 'Your Friend (the Invitee)',
        inviteeDiscount: '10%',
        inviteeDesc: 'Your friend gets 10% off their first order at RHP Creatives.',
        howTitle: 'How It Works',
        steps: [
          'Contact us and request your unique referral code',
          'Share the code with friends who need our services',
          'Your friend orders using your referral code',
          'Discounts are automatically applied for both of you',
        ],
        cta: 'Get Referral Code →',
      },
      affiliate: {
        label: 'Earn with RHP',
        title: 'Affiliate Program',
        sub: 'Join as an RHP Creatives affiliate and earn commissions for every client you refer.',
        tiers: [
          { name: 'Starter', range: '1–4 referrals', commission: '5% Commission' },
          { name: 'Growth', range: '5–14 referrals', commission: '7% Commission' },
          { name: 'Pro', range: '15+ referrals', commission: '10% Commission' },
        ],
        payoutMin: 'Rp50.000',
        payoutDate: '1st & 15th of every month',
        benefitLabel: 'Affiliate Benefits',
        benefits: [
          'Commission per successful referral',
          'Real-time tracking dashboard',
          'Minimum payout Rp50.000',
          'Payment on the 1st & 15th monthly',
          'Promotional material support',
        ],
        cta: 'Register as Affiliate →',
      },
    },
  },
}
