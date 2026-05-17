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


export type Tr = {
  nav: {
    home: string
    layananDigital: string
    layananDesain: string
    testimoni: string
    promo: string
    about: string
    cta: string
    login: string
    logout: string
    profileLink: string
  }
  auth: {
    loginTitle: string
    loginSub: string
    googleBtn: string
    googleConnecting: string
    orDivider: string
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    submitLogin: string
    loggingIn: string
    errorInvalid: string
    noAccount: string
    registerLink: string
    registerTitle: string
    registerSub: string
    nameLabel: string
    namePlaceholder: string
    confirmLabel: string
    confirmPlaceholder: string
    passwordMin: string
    submitRegister: string
    registering: string
    passwordMismatch: string
    hasAccount: string
    loginLink: string
  }
  profile: {
    referralLabel: string
    copyBtn: string
    copied: string
    shareNote: string
    rewardLabel: string
    referrerTitle: string
    referrerDesc: string
    inviteeTitle: string
    inviteeDesc: string
    statsLabel: string
    statPeople: string
    statReward: string
    statsNote: string
    howToLabel: string
    steps: string[]
    logoutBtn: string
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
      login: 'Masuk',
      logout: 'Keluar',
      profileLink: 'Profil & Referral',
    },
    auth: {
      loginTitle: 'Selamat datang kembali',
      loginSub: 'Masuk ke akun kamu untuk lanjut',
      googleBtn: 'Lanjutkan dengan Google',
      googleConnecting: 'Menghubungkan...',
      orDivider: 'atau',
      emailLabel: 'Email',
      emailPlaceholder: 'kamu@email.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      submitLogin: 'Masuk',
      loggingIn: 'Masuk...',
      errorInvalid: 'Email atau password salah.',
      noAccount: 'Belum punya akun?',
      registerLink: 'Daftar sekarang',
      registerTitle: 'Buat akun baru',
      registerSub: 'Daftar gratis, mulai sekarang',
      nameLabel: 'Nama lengkap',
      namePlaceholder: 'Nama kamu',
      confirmLabel: 'Konfirmasi password',
      confirmPlaceholder: 'Ulangi password',
      passwordMin: 'Min. 8 karakter',
      submitRegister: 'Daftar sekarang',
      registering: 'Mendaftarkan...',
      passwordMismatch: 'Password dan konfirmasi password tidak cocok.',
      hasAccount: 'Sudah punya akun?',
      loginLink: 'Masuk di sini',
    },
    profile: {
      referralLabel: 'Kode Referral Kamu',
      copyBtn: 'Salin Kode',
      copied: 'Tersalin!',
      shareNote: 'Bagikan kode ini ke teman-teman kamu',
      rewardLabel: 'Reward Referral',
      referrerTitle: 'Kamu (pengajak)',
      referrerDesc: 'Diskon 15% untuk order berikutnya',
      inviteeTitle: 'Teman kamu (diajak)',
      inviteeDesc: 'Diskon 10% untuk order pertamanya',
      statsLabel: 'Statistik Referral',
      statPeople: 'Orang pakai kode',
      statReward: 'Total reward didapat',
      statsNote: 'Statistik update otomatis saat teman menggunakan kode referral kamu',
      howToLabel: 'Cara Pakai Referral',
      steps: [
        'Salin kode referral kamu di atas',
        'Bagikan ke teman yang mau order jasa RHP Creatives',
        'Teman daftar & sebutkan kode saat order via WhatsApp',
        'Kalian berdua otomatis dapat diskon!',
      ],
      logoutBtn: 'Keluar',
    },
    hero: {
      tag: '✦ Jasa Digital & Desain Kreatif',
      titleBefore: 'Wujudkan Kehadiran ',
      titleEm: 'Digital',
      titleAfter: 'yang Berkesan',
      sub: 'RHP Creatives hadir untuk membantu Anda tampil profesional di dunia digital — dari undangan online, landing page, hingga desain grafis berkualitas.',
      cta1: 'Mulai Proyek ↗',
      cta2: 'Lihat Layanan →',
      stat1Label: 'Layanan Tersedia',
      stat2Label: 'Pengerjaan Cepat',
      stat3Label: 'Revisi Inklusif',
      cardDesc: 'Undangan Online · Landing Page · Desain Instagram · Edit Foto',
      cardPrice: 'Mulai Rp20.000',
      cardBadge: '⚡ Early Bird Diskon 25%',
      cardSatisfaction: 'Kepuasan Klien #1',
    },
    pageHero: {
      layananDigital: {
        label: 'Layanan Digital',
        title: 'Solusi Digital untuk Bisnis Anda',
        sub: 'Dari undangan online hingga landing page profesional — kami hadir untuk membantu Anda tampil terbaik di dunia digital.',
      },
      layananDesain: {
        label: 'Layanan Desain',
        title: 'Desain Grafis yang Memukau',
        sub: 'Konten visual berkualitas untuk Instagram dan editing foto profesional — untuk tampilan yang selalu estetis dan siap pakai.',
      },
      testimoni: {
        label: 'Testimoni',
        title: 'Apa Kata Klien Kami',
        sub: 'Kepuasan klien adalah prioritas utama. Simak pengalaman nyata mereka bersama RHP Creatives.',
      },
      promo: {
        label: 'Promo & Penawaran',
        title: 'Penawaran Spesial RHP Creatives',
        sub: 'Hemat lebih banyak dengan Early Bird, Paket Bundling, dan Program Referral kami.',
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
      digitalSub: 'Undangan online dan landing page profesional untuk kehadiran digital yang kuat.',
      digitalItems: ['Undangan Online', 'Landing Page'],
      digitalCta: 'Lihat Detail & Harga →',
      designTitle: 'Layanan Desain',
      designSub: 'Desain grafis berkualitas untuk konten Instagram dan editing foto profesional.',
      designItems: ['Desain Instagram', 'Edit Foto'],
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
          desc: 'Undangan pernikahan, ulang tahun, dan acara spesial dalam format digital yang elegan dan mudah dibagikan — dari Simpel hingga Sultan.',
          features: ['Desain custom & personal', 'RSVP & countdown timer', 'Peta lokasi & galeri foto'],
        },
        {
          num: '02',
          name: 'Landing Page',
          desc: 'Halaman promosi satu halaman yang fokus pada konversi — cocok untuk produk, event, atau kampanye bisnis Anda.',
          features: ['Desain modern & persuasif', 'Mobile-first responsive', 'Tombol WhatsApp / CTA'],
        },
      ],
      design: [
        {
          num: '03',
          name: 'Desain Instagram',
          desc: 'Feed, story, dan highlight cover yang konsisten, estetis, dan sesuai identitas brand — tersedia per post hingga paket bulanan.',
          features: ['Feed, story & highlight', 'Konsisten dengan branding', 'Format siap upload'],
        },
        {
          num: '04',
          name: 'Edit Foto — Ganti Background & Pas Foto',
          desc: 'Ganti background foto, poles tampilan, cocok untuk foto formal, pas foto, KTP, LinkedIn, dan lamaran kerja.',
          features: ['Ganti background foto', 'Rapikan & poles tampilan', 'Output resolusi tinggi'],
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
              name: 'Undangan Simpel',
              price: 'Rp79.000',
              period: 'per undangan',
              delivery: '1 hari',
              features: ['Desain template pilihan', 'Info acara lengkap', 'Link undangan personal'],
            },
            {
              name: 'Undangan Aesthetic',
              price: 'Rp139.000',
              period: 'per undangan',
              delivery: '2 hari',
              highlighted: true,
              features: ['Semua fitur Simpel', 'Form RSVP online', 'Countdown timer', 'Peta lokasi Google Maps', 'Revisi 1x'],
            },
            {
              name: 'Undangan Sultan',
              price: 'Rp219.000',
              period: 'per undangan',
              delivery: '3 hari',
              features: ['Semua fitur Aesthetic', 'Galeri foto', 'Musik latar', 'Efek animasi', 'Revisi 2x'],
            },
          ],
          revisiNote: 'Revisi di luar paket: Rp35.000/revisi',
        },
        {
          name: 'Landing Page',
          tiers: [
            {
              name: 'Halaman Santuy',
              price: 'Rp299.000',
              period: 'per halaman',
              delivery: '2 hari',
              features: ['1 halaman desain', 'Tampilan clean & modern', 'Tombol WhatsApp', 'Mobile-friendly'],
            },
            {
              name: 'Halaman Kece',
              price: 'Rp649.000',
              period: 'per halaman',
              delivery: '4 hari',
              highlighted: true,
              features: ['Semua fitur Santuy', 'Form kontak', 'Full mobile responsive', 'Revisi 2x'],
            },
            {
              name: 'Halaman Sultan',
              price: 'Rp1.099.000',
              period: 'per halaman',
              delivery: '5-7 hari',
              features: ['Semua fitur Kece', 'Animasi & transisi', 'SEO dasar', 'Revisi 3x'],
            },
          ],
          revisiNote: 'Revisi di luar paket: Rp50.000/revisi',
        },
      ],
      design: [
        {
          name: 'Desain Instagram',
          tiers: [
            {
              name: 'Satu Post Dulu',
              price: 'Rp40.000',
              period: 'per post',
              delivery: '1-2 hari',
              features: ['1 konten feed atau story', 'Revisi 1x'],
            },
            {
              name: 'Feed Pemula',
              price: 'Rp175.000',
              period: 'per 5 post',
              delivery: '3-4 hari',
              save: 'Hemat Rp25.000',
              features: ['5 konten feed & story', 'Revisi 1x per konten'],
            },
            {
              name: 'Feed Aesthetic',
              price: 'Rp299.000',
              period: 'per 10 post',
              delivery: '5-7 hari',
              highlighted: true,
              save: 'Hemat Rp101.000',
              features: ['10 konten feed & story', 'Revisi 2x per konten', 'Prioritas antrian'],
            },
            {
              name: 'Feed Sultan',
              price: 'Rp699.000',
              period: 'per bulan',
              delivery: 'Ongoing',
              features: ['20 desain per bulan', 'Feed & story', 'Tone & branding konsisten', 'Revisi 1x per konten', 'Prioritas antrian'],
            },
          ],
        },
        {
          name: 'Edit Foto — Ganti Background & Pas Foto',
          tiers: [
            {
              name: 'Poles Dikit',
              price: 'Rp20.000',
              period: 'per foto',
              delivery: '1 hari',
              features: ['Ganti background foto', 'Rapikan tampilan', 'Output JPG/PNG'],
            },
            {
              name: 'Poles Banyak',
              price: 'Rp75.000',
              period: 'per 5 foto',
              delivery: '2-3 hari',
              save: 'Hemat Rp25.000',
              features: ['5 foto', 'Background konsisten', 'Retouch & color grading', 'Resolusi tinggi'],
            },
            {
              name: 'Poles Abis',
              price: 'Rp130.000',
              period: 'per 10 foto',
              delivery: '3-5 hari',
              highlighted: true,
              save: 'Hemat Rp70.000',
              features: ['10 foto', 'Background removal', 'Retouch & color grading', 'Resolusi tinggi', 'Revisi 1x/foto'],
            },
          ],
          revisiNote: 'Cocok untuk foto formal, pas foto, KTP, LinkedIn, lamaran kerja.',
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
        { num: '4+', label: 'Layanan Tersedia' },
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
        desc: 'Dapatkan diskon 25% untuk semua layanan. Hanya untuk 20 klien pertama. Berlaku 1 bulan sejak launch. DP minimal 50% saat konfirmasi order.',
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
            name: 'Paket Kondangan Aesthetic',
            includes: 'Undangan Aesthetic + Feed Pemula',
            price: 'Rp264.000',
            originalPrice: 'Rp314.000',
            save: 'Hemat Rp50.000',
          },
          {
            name: 'Paket Kondangan Sultan',
            includes: 'Undangan Sultan + Feed Aesthetic + Poles Banyak',
            price: 'Rp489.000',
            originalPrice: 'Rp593.000',
            save: 'Hemat Rp104.000',
          },
          {
            name: 'Paket Bisnis Santuy',
            includes: 'Halaman Santuy + Feed Pemula',
            price: 'Rp399.000',
            originalPrice: 'Rp474.000',
            save: 'Hemat Rp75.000',
          },
          {
            name: 'Paket Bisnis Gasken',
            includes: 'Halaman Kece + Feed Aesthetic',
            price: 'Rp799.000',
            originalPrice: 'Rp948.000',
            save: 'Hemat Rp149.000',
          },
          {
            name: 'Paket Konten Aesthetic',
            includes: 'Feed Aesthetic + Poles Banyak',
            price: 'Rp319.000',
            originalPrice: 'Rp374.000',
            save: 'Hemat Rp55.000',
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
        referrerDesc: 'Dapatkan diskon 15% untuk order berikutnya setiap kali temanmu melakukan order pertama melalui referral kamu. Berlaku permanen.',
        inviteeTitle: 'Teman yang Diajak',
        inviteeDiscount: '10%',
        inviteeDesc: 'Teman yang kamu ajak mendapatkan diskon 10% untuk order pertama mereka di RHP Creatives. Berlaku permanen.',
        howTitle: 'Cara Kerja',
        steps: [
          'Hubungi kami dan minta kode referral unikmu',
          'Bagikan kode ke teman yang membutuhkan jasa kami',
          'Temanmu order menggunakan kode referral',
          'Diskon otomatis berlaku untuk kalian berdua',
        ],
        cta: 'Minta Kode Referral →',
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
      login: 'Sign In',
      logout: 'Sign Out',
      profileLink: 'Profile & Referral',
    },
    auth: {
      loginTitle: 'Welcome back',
      loginSub: 'Sign in to your account to continue',
      googleBtn: 'Continue with Google',
      googleConnecting: 'Connecting...',
      orDivider: 'or',
      emailLabel: 'Email',
      emailPlaceholder: 'you@email.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      submitLogin: 'Sign In',
      loggingIn: 'Signing in...',
      errorInvalid: 'Invalid email or password.',
      noAccount: "Don't have an account?",
      registerLink: 'Register now',
      registerTitle: 'Create a new account',
      registerSub: 'Free to join, start now',
      nameLabel: 'Full name',
      namePlaceholder: 'Your name',
      confirmLabel: 'Confirm password',
      confirmPlaceholder: 'Repeat password',
      passwordMin: 'Min. 8 characters',
      submitRegister: 'Create account',
      registering: 'Creating account...',
      passwordMismatch: 'Password and confirmation do not match.',
      hasAccount: 'Already have an account?',
      loginLink: 'Sign in here',
    },
    profile: {
      referralLabel: 'Your Referral Code',
      copyBtn: 'Copy Code',
      copied: 'Copied!',
      shareNote: 'Share this code with your friends',
      rewardLabel: 'Referral Rewards',
      referrerTitle: 'You (the referrer)',
      referrerDesc: '15% discount on your next order',
      inviteeTitle: 'Your friend (the invitee)',
      inviteeDesc: '10% discount on their first order',
      statsLabel: 'Referral Stats',
      statPeople: 'People used your code',
      statReward: 'Total reward earned',
      statsNote: 'Stats update automatically when a friend uses your referral code',
      howToLabel: 'How to Use Referral',
      steps: [
        'Copy your referral code above',
        'Share it with friends who want RHP Creatives services',
        'Friend registers & mentions the code when ordering via WhatsApp',
        'You both automatically get a discount!',
      ],
      logoutBtn: 'Sign Out',
    },
    hero: {
      tag: '✦ Digital & Creative Design Services',
      titleBefore: 'Build a Memorable ',
      titleEm: 'Digital',
      titleAfter: 'Presence',
      sub: 'RHP Creatives is here to help you stand out professionally in the digital world — from online invitations and landing pages to quality graphic design.',
      cta1: 'Start Project ↗',
      cta2: 'View Services →',
      stat1Label: 'Services Available',
      stat2Label: 'Fast Delivery',
      stat3Label: 'Revisions Included',
      cardDesc: 'Online Invitation · Landing Page · Instagram Design · Photo Edit',
      cardPrice: 'Starting from Rp20.000',
      cardBadge: '⚡ Early Bird 25% Off',
      cardSatisfaction: 'Client Satisfaction #1',
    },
    pageHero: {
      layananDigital: {
        label: 'Digital Services',
        title: 'Digital Solutions for Your Business',
        sub: 'From online invitations to professional landing pages — we help you put your best foot forward in the digital world.',
      },
      layananDesain: {
        label: 'Design Services',
        title: 'Stunning Graphic Design',
        sub: 'Quality visual content for Instagram and professional photo editing — for a look that is always aesthetic and upload-ready.',
      },
      testimoni: {
        label: 'Testimonials',
        title: 'What Our Clients Say',
        sub: 'Client satisfaction is our top priority. Read their real experiences with RHP Creatives.',
      },
      promo: {
        label: 'Promos & Deals',
        title: 'Special Offers from RHP Creatives',
        sub: 'Save more with our Early Bird discount, Bundle Packages, and Referral Program.',
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
      digitalItems: ['Online Invitation', 'Landing Page'],
      digitalCta: 'View Details & Pricing →',
      designTitle: 'Design Services',
      designSub: 'Quality graphic design for Instagram content and professional photo editing.',
      designItems: ['Instagram Design', 'Photo Editing'],
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
      ],
      design: [
        {
          num: '03',
          name: 'Instagram Design',
          desc: 'Consistent, aesthetic feed, story, and highlight covers aligned with your brand — available per post or monthly packages.',
          features: ['Feed, story & highlight', 'Consistent with branding', 'Upload-ready format'],
        },
        {
          num: '04',
          name: 'Photo Edit — Background Swap & ID Photo',
          desc: 'Swap photo backgrounds, polish appearance — ideal for formal photos, ID photos, KTP, LinkedIn, and job applications.',
          features: ['Background swap', 'Clean up & polish appearance', 'High-resolution output'],
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
              name: 'Simple Invite',
              price: 'Rp79.000',
              period: 'per invitation',
              delivery: '1 day',
              features: ['Template design', 'Full event info', 'Personal invitation link'],
            },
            {
              name: 'Aesthetic Invite',
              price: 'Rp139.000',
              period: 'per invitation',
              delivery: '2 days',
              highlighted: true,
              features: ['All Simple features', 'Online RSVP form', 'Countdown timer', 'Google Maps location', '1x revision'],
            },
            {
              name: 'Sultan Invite',
              price: 'Rp219.000',
              period: 'per invitation',
              delivery: '3 days',
              features: ['All Aesthetic features', 'Photo gallery', 'Background music', 'Animation effects', '2x revisions'],
            },
          ],
          revisiNote: 'Extra revision: Rp35.000/revision',
        },
        {
          name: 'Landing Page',
          tiers: [
            {
              name: 'Chill Page',
              price: 'Rp299.000',
              period: 'per page',
              delivery: '2 days',
              features: ['1-page design', 'Clean & modern look', 'WhatsApp button', 'Mobile-friendly'],
            },
            {
              name: 'Kece Page',
              price: 'Rp649.000',
              period: 'per page',
              delivery: '4 days',
              highlighted: true,
              features: ['All Chill features', 'Contact form', 'Full mobile responsive', '2x revisions'],
            },
            {
              name: 'Sultan Page',
              price: 'Rp1.099.000',
              period: 'per page',
              delivery: '5-7 days',
              features: ['All Kece features', 'Animations & transitions', 'Basic SEO', '3x revisions'],
            },
          ],
          revisiNote: 'Extra revision: Rp50.000/revision',
        },
      ],
      design: [
        {
          name: 'Instagram Design',
          tiers: [
            {
              name: 'One Post First',
              price: 'Rp40.000',
              period: 'per post',
              delivery: '1-2 days',
              features: ['1 feed or story content', '1x revision'],
            },
            {
              name: 'Starter Feed',
              price: 'Rp175.000',
              period: 'per 5 posts',
              delivery: '3-4 days',
              save: 'Save Rp25.000',
              features: ['5 feed & story content', '1x revision per content'],
            },
            {
              name: 'Aesthetic Feed',
              price: 'Rp299.000',
              period: 'per 10 posts',
              delivery: '5-7 days',
              highlighted: true,
              save: 'Save Rp101.000',
              features: ['10 feed & story content', '2x revisions per content', 'Priority queue'],
            },
            {
              name: 'Sultan Feed',
              price: 'Rp699.000',
              period: 'per month',
              delivery: 'Ongoing',
              features: ['20 designs per month', 'Feed & story', 'Consistent tone & branding', '1x revision per content', 'Priority queue'],
            },
          ],
        },
        {
          name: 'Photo Edit — Background Swap & ID Photo',
          tiers: [
            {
              name: 'Quick Polish',
              price: 'Rp20.000',
              period: 'per photo',
              delivery: '1 day',
              features: ['Background swap', 'Clean up appearance', 'JPG/PNG output'],
            },
            {
              name: 'Full Polish',
              price: 'Rp75.000',
              period: 'per 5 photos',
              delivery: '2-3 days',
              save: 'Save Rp25.000',
              features: ['5 photos', 'Consistent background', 'Retouch & color grading', 'High resolution'],
            },
            {
              name: 'Max Polish',
              price: 'Rp130.000',
              period: 'per 10 photos',
              delivery: '3-5 days',
              highlighted: true,
              save: 'Save Rp70.000',
              features: ['10 photos', 'Background removal', 'Retouch & color grading', 'High resolution', '1x revision/photo'],
            },
          ],
          revisiNote: 'Ideal for formal photos, ID photos, KTP, LinkedIn, job applications.',
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
        { num: '4+', label: 'Services Available' },
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
        desc: 'Get 25% off all services. Available for the first 20 clients only. Valid for 1 month from launch. Minimum 50% down payment upon order confirmation.',
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
            name: 'Aesthetic Wedding Pack',
            includes: 'Aesthetic Invite + Starter Feed',
            price: 'Rp264.000',
            originalPrice: 'Rp314.000',
            save: 'Save Rp50.000',
          },
          {
            name: 'Sultan Wedding Pack',
            includes: 'Sultan Invite + Aesthetic Feed + Full Polish',
            price: 'Rp489.000',
            originalPrice: 'Rp593.000',
            save: 'Save Rp104.000',
          },
          {
            name: 'Chill Business Pack',
            includes: 'Chill Page + Starter Feed',
            price: 'Rp399.000',
            originalPrice: 'Rp474.000',
            save: 'Save Rp75.000',
          },
          {
            name: 'Business Go Pack',
            includes: 'Kece Page + Aesthetic Feed',
            price: 'Rp799.000',
            originalPrice: 'Rp948.000',
            save: 'Save Rp149.000',
          },
          {
            name: 'Aesthetic Content Pack',
            includes: 'Aesthetic Feed + Full Polish',
            price: 'Rp319.000',
            originalPrice: 'Rp374.000',
            save: 'Save Rp55.000',
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
        referrerDesc: 'Earn a 15% discount on your next order every time a friend makes their first order through your referral. Valid permanently.',
        inviteeTitle: 'Your Friend (the Invitee)',
        inviteeDiscount: '10%',
        inviteeDesc: 'Your friend gets 10% off their first order at RHP Creatives. Valid permanently.',
        howTitle: 'How It Works',
        steps: [
          'Contact us and request your unique referral code',
          'Share the code with friends who need our services',
          'Your friend orders using your referral code',
          'Discounts are automatically applied for both of you',
        ],
        cta: 'Get Referral Code →',
      },
    },
  },
}
