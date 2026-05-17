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
  rating: number
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
    tabReferral: string
    tabOrders: string
    noOrders: string
    orderDate: string
    orderStatus: string
    orderAmount: string
    viewOrder: string
    statusPending: string
    statusPaid: string
    statusProcessing: string
    statusCompleted: string
    statusCancelled: string
  }
  orderPage: {
    tag: string
    title: string
    sub: string
    step1: string
    step2: string
    step3: string
    step4: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    waLabel: string
    waPlaceholder: string
    notesLabel: string
    notesPlaceholder: string
    voucherLabel: string
    voucherPlaceholder: string
    voucherApply: string
    voucherApplied: string
    voucherInvalid: string
    summaryLabel: string
    originalPrice: string
    discount: string
    total: string
    payBtn: string
    paying: string
    loginPrompt: string
    loginBtn: string
    selectFirst: string
    errorGeneral: string
  }
  orderSuccess: {
    title: string
    sub: string
    orderIdLabel: string
    serviceLabel: string
    packageLabel: string
    amountLabel: string
    statusLabel: string
    statusPending: string
    statusPaid: string
    statusProcessing: string
    statusCompleted: string
    statusCancelled: string
    waBtn: string
    homeBtn: string
    orderHistoryBtn: string
    notFoundTitle: string
    notFoundSub: string
  }
  adminOrders: {
    title: string
    sub: string
    filterAll: string
    filterPending: string
    filterPaid: string
    filterProcessing: string
    filterCompleted: string
    filterCancelled: string
    exportCsv: string
    colId: string
    colCustomer: string
    colService: string
    colAmount: string
    colStatus: string
    colDate: string
    noOrders: string
    updateStatus: string
    accessDenied: string
    loading: string
    totalOrders: string
    totalRevenue: string
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
  promoBar: {
    text: string
    days: string
    hrs: string
    mins: string
    secs: string
  }
  earlyBirdPopup: {
    headline: string
    sub: string
    slotsLeft: string
    cta: string
    dismiss: string
  }
  pricingBanner: {
    badge: string
    title: string
    sub: string
  }
  floatingBadge: {
    text: string
    sub: string
  }
  claimPage: {
    title: string
    sub: string
    slotsLeft: string
    formTitle: string
    nameLabel: string
    emailLabel: string
    waLabel: string
    waPlaceholder: string
    serviceLabel: string
    serviceOptions: string[]
    submitBtn: string
    submitting: string
    successTitle: string
    successSub: string
    voucherLabel: string
    copyBtn: string
    copied: string
    shareWaBtn: string
    orderWaBtn: string
    howTitle: string
    howText: string
    alreadyTitle: string
    alreadySub: string
    claimedAtLabel: string
    quotaFullTitle: string
    quotaFullSub: string
    waitlistTitle: string
    waitlistEmailLabel: string
    waitlistWaLabel: string
    waitlistWaPlaceholder: string
    waitlistSubmit: string
    waitlistSuccess: string
    loading: string
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
      tabReferral: 'Referral & Stats',
      tabOrders: 'Riwayat Order',
      noOrders: 'Belum ada order. Yuk order sekarang!',
      orderDate: 'Tanggal',
      orderStatus: 'Status',
      orderAmount: 'Total',
      viewOrder: 'Lihat Detail',
      statusPending: 'Menunggu Bayar',
      statusPaid: 'Sudah Dibayar',
      statusProcessing: 'Diproses',
      statusCompleted: 'Selesai',
      statusCancelled: 'Dibatalkan',
    },
    orderPage: {
      tag: '✦ Pesan Layanan',
      title: 'Pesan Layanan RHP Creatives',
      sub: 'Pilih layanan, isi data, dan bayar langsung. Gampang banget!',
      step1: 'Pilih Layanan',
      step2: 'Pilih Paket',
      step3: 'Info Kamu',
      step4: 'Voucher (Opsional)',
      nameLabel: 'Nama Lengkap',
      namePlaceholder: 'Nama kamu',
      emailLabel: 'Email',
      waLabel: 'Nomor WhatsApp',
      waPlaceholder: '08xxxxxxxxxx',
      notesLabel: 'Catatan Tambahan',
      notesPlaceholder: 'Ceritain kebutuhan kamu di sini (opsional)',
      voucherLabel: 'Kode Voucher',
      voucherPlaceholder: 'EBIRD-XXXXX',
      voucherApply: 'Terapkan',
      voucherApplied: '✓ Voucher berhasil! Diskon 25% diterapkan',
      voucherInvalid: '✗ Kode voucher tidak valid',
      summaryLabel: 'Ringkasan Order',
      originalPrice: 'Harga asli',
      discount: 'Diskon Early Bird',
      total: 'Total Bayar',
      payBtn: 'Bayar Sekarang →',
      paying: 'Memproses...',
      loginPrompt: 'Login dulu buat lanjut bayar ya!',
      loginBtn: 'Login Sekarang →',
      selectFirst: 'Pilih layanan dan paket dulu',
      errorGeneral: 'Gagal membuat transaksi. Coba lagi.',
    },
    orderSuccess: {
      title: 'Yay! Order Berhasil! 🎉',
      sub: 'Order kamu udah masuk. Tim kami akan segera follow up via WhatsApp.',
      orderIdLabel: 'Order ID',
      serviceLabel: 'Layanan',
      packageLabel: 'Paket',
      amountLabel: 'Total Bayar',
      statusLabel: 'Status',
      statusPending: 'Menunggu Pembayaran',
      statusPaid: 'Sudah Dibayar',
      statusProcessing: 'Sedang Diproses',
      statusCompleted: 'Selesai',
      statusCancelled: 'Dibatalkan',
      waBtn: 'Hubungi via WhatsApp →',
      homeBtn: 'Kembali ke Beranda',
      orderHistoryBtn: 'Lihat Semua Order',
      notFoundTitle: 'Order Tidak Ditemukan',
      notFoundSub: 'Order dengan ID ini tidak ada atau kamu tidak punya akses.',
    },
    adminOrders: {
      title: 'Admin — Daftar Order',
      sub: 'Kelola semua order yang masuk',
      filterAll: 'Semua',
      filterPending: 'Menunggu',
      filterPaid: 'Dibayar',
      filterProcessing: 'Diproses',
      filterCompleted: 'Selesai',
      filterCancelled: 'Dibatalkan',
      exportCsv: 'Export CSV',
      colId: 'Order ID',
      colCustomer: 'Pelanggan',
      colService: 'Layanan',
      colAmount: 'Total',
      colStatus: 'Status',
      colDate: 'Tanggal',
      noOrders: 'Belum ada order',
      updateStatus: 'Update Status',
      accessDenied: 'Akses ditolak. Kamu bukan admin.',
      loading: 'Memuat...',
      totalOrders: 'Total Order',
      totalRevenue: 'Total Pendapatan',
    },
    hero: {
      tag: '✦ Jasa Digital & Desain Kreatif',
      titleBefore: 'Tampil ',
      titleEm: 'Keren',
      titleAfter: ' di Dunia Digital? Gas!',
      sub: 'RHP Creatives siap bantu kamu dari nol: undangan online, landing page, feed IG aesthetic, sampai edit foto buat lamaran. Gasken!',
      cta1: 'Mulai Sekarang ↗',
      cta2: 'Lihat Harga →',
      stat1Label: 'Layanan Tersedia',
      stat2Label: 'Pengerjaan Sat-Set',
      stat3Label: 'Revisi Included',
      cardDesc: 'Undangan · Landing Page · Feed IG · Edit Foto',
      cardPrice: 'Mulai Rp20.000',
      cardBadge: '⚡ Early Bird Diskon 25%',
      cardSatisfaction: '100% Worth It, No Cap',
    },
    pageHero: {
      layananDigital: {
        label: 'Layanan Digital',
        title: 'Digital Solution yang Sat-Set',
        sub: 'Undangan online atau landing page, kamu tinggal cerita kebutuhan dan kita yang eksekusi. Hasilnya? Auto kece.',
      },
      layananDesain: {
        label: 'Layanan Desain',
        title: 'Desain yang Bikin Orang Stop Scroll',
        sub: 'Feed IG aesthetic, edit foto rapi. Semua bisa! Tinggal duduk, relax, hasilnya langsung masuk.',
      },
      testimoni: {
        label: 'Testimoni',
        title: 'Kata Mereka yang Udah Coba',
        sub: 'Bukan lebay, bukan dibayar. Ini cerita nyata dari klien RHP Creatives. Judge sendiri deh.',
      },
      promo: {
        label: 'Promo & Penawaran',
        title: 'Penawaran yang Sayang Banget Dilewatin',
        sub: 'Hemat lebih banyak dengan Early Bird, Paket Bundling, dan Program Referral kami.',
      },
      about: {
        label: 'Tentang Kami',
        title: 'Halo, Kami RHP Creatives 👋',
        sub: 'Tim kreatif muda yang obsesi bikin karya kece supaya bisnis dan personal kamu keliatan profesional di dunia digital.',
      },
    },
    homeOverview: {
      label: 'Layanan Kami',
      title: 'Mau Tampil Kece di Mana Aja?',
      sub: 'Dua kategori layanan lengkap buat semua kebutuhan digital dan desain kamu.',
      digitalTitle: 'Layanan Digital',
      digitalSub: 'Undangan online dan landing page yang bikin orang langsung notice.',
      digitalItems: ['Undangan Online', 'Landing Page'],
      digitalCta: 'Lihat Detail & Harga →',
      designTitle: 'Layanan Desain',
      designSub: 'Desain Instagram estetis dan edit foto rapi untuk tampilan yang selalu on point.',
      designItems: ['Desain Instagram', 'Edit Foto'],
      designCta: 'Lihat Detail & Harga →',
    },
    services: {
      label: 'Apa yang Kami Kerjain',
      title: 'Layanan RHP Creatives',
      sub: 'Dari digital sampai desain, semua ada, semua kece, semua worth it.',
      headerCta: 'Konsultasi Gratis ↗',
      digitalLabel: '✦ Layanan Digital',
      designLabel: '✦ Layanan Desain',
      digital: [
        {
          num: '01',
          name: 'Undangan Online',
          desc: 'Mau nikahan, ultah, atau gathering? Undangan online kamu bakal keliatan premium banget. Tinggal share link, tamu langsung impressed.',
          features: ['Desain personal sesuai tema kamu', 'RSVP & countdown otomatis', 'Peta Google Maps langsung'],
        },
        {
          num: '02',
          name: 'Landing Page',
          desc: 'Produk bagus tapi sepi peminat? Landing page yang tepat = konversi naik, DM masuk, dompet seneng. Literally works!',
          features: ['Desain yang bikin orang langsung klik', 'Mobile-first, loading ngebut', 'Tombol WA sekali klik'],
        },
      ],
      design: [
        {
          num: '03',
          name: 'Desain Instagram',
          desc: 'Feed berantakan itu red flag. Bikin feed IG kamu auto aesthetic, konsisten, dan bikin orang penasaran scroll terus.',
          features: ['Feed, story & highlight cover', 'Konsisten sama branding kamu', 'Siap upload langsung'],
        },
        {
          num: '04',
          name: 'Edit Foto — Ganti Background & Pas Foto',
          desc: 'Foto KTP panik? Background foto asal-asalan? Tenang, kita beresin semuanya. Hasilnya foto kamu bakal keliatan profesional beneran.',
          features: ['Ganti background foto', 'Rapikan & poles tampilan', 'Output resolusi tinggi'],
        },
      ],
    },
    pricing: {
      label: 'Harga Transparan',
      title: 'Paket & Harga Layanan',
      sub: 'Harga bisa disesuaikan sama kebutuhanmu. Hubungi kami dulu kalau mau tanya-tanya, gratis kok!',
      digitalLabel: '✦ Layanan Digital',
      designLabel: '✦ Layanan Desain',
      note: '* Semua harga estimasi. Konsultasikan kebutuhan kamu buat harga final yang sesuai.',
      popularBadge: 'Paling Laku ⚡',
      orderCta: 'Pesan Sekarang →',
      consultCta: 'Konsultasi Dulu →',
      digital: [
        {
          name: 'Undangan Online',
          tiers: [
            {
              name: 'Undangan Simpel',
              price: 'Rp79.000',
              period: 'per undangan',
              delivery: '1 hari',
              features: ['Template pilihan yang udah keren', 'Info acara lengkap & rapi', 'Link undangan siap share'],
            },
            {
              name: 'Undangan Aesthetic',
              price: 'Rp139.000',
              period: 'per undangan',
              delivery: '2 hari',
              highlighted: true,
              features: ['Semua dari Simpel ✓', 'Form RSVP online biar tamu konfirm langsung', 'Countdown timer — makin deg-degan!', 'Google Maps, anti nyasar', 'Revisi 1x'],
            },
            {
              name: 'Undangan Sultan',
              price: 'Rp219.000',
              period: 'per undangan',
              delivery: '3 hari',
              features: ['Semua dari Aesthetic ✓', 'Galeri foto buat kenangan', 'Musik latar yang bikin baper', 'Efek animasi smooth', 'Revisi 2x'],
            },
          ],
          revisiNote: 'Revisi extra: Rp35.000/revisi (hasilnya tetep worth it kok!)',
        },
        {
          name: 'Landing Page',
          tiers: [
            {
              name: 'Halaman Santuy',
              price: 'Rp299.000',
              period: 'per halaman',
              delivery: '2 hari',
              features: ['1 halaman, clean & kece', 'Tampilan profesional beneran', 'Tombol WA langsung keklik', 'Mobile-friendly auto'],
            },
            {
              name: 'Halaman Kece',
              price: 'Rp649.000',
              period: 'per halaman',
              delivery: '4 hari',
              highlighted: true,
              features: ['Semua dari Santuy ✓', 'Form kontak buat yang serius', 'Responsive di semua HP', 'Revisi 2x'],
            },
            {
              name: 'Halaman Sultan',
              price: 'Rp1.099.000',
              period: 'per halaman',
              delivery: '5-7 hari',
              features: ['Semua dari Kece ✓', 'Animasi & transisi mulus', 'SEO dasar biar ketemu di Google', 'Revisi 3x'],
            },
          ],
          revisiNote: 'Revisi extra: Rp50.000/revisi',
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
              features: ['1 konten feed atau story', 'Revisi 1x included'],
            },
            {
              name: 'Feed Pemula',
              price: 'Rp175.000',
              period: 'per 5 post',
              delivery: '3-4 hari',
              save: 'Hemat Rp25.000',
              features: ['5 konten feed & story', 'Hemat vs harga satuan', 'Revisi 1x per konten'],
            },
            {
              name: 'Feed Aesthetic',
              price: 'Rp299.000',
              period: 'per 10 post',
              delivery: '5-7 hari',
              highlighted: true,
              save: 'Hemat Rp101.000',
              features: ['10 konten feed & story', 'Revisi 2x per konten', 'Antrian prioritas'],
            },
            {
              name: 'Feed Sultan',
              price: 'Rp699.000',
              period: 'per bulan',
              delivery: 'Ongoing',
              features: ['20 desain per bulan', 'Feed & story lengkap', 'Tone & branding konsisten', 'Revisi 1x per konten', 'Antrian prioritas'],
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
              features: ['Ganti background foto', 'Rapikan tampilan', 'Output JPG/PNG bersih'],
            },
            {
              name: 'Poles Banyak',
              price: 'Rp75.000',
              period: 'per 5 foto',
              delivery: '2-3 hari',
              save: 'Hemat Rp25.000',
              features: ['5 foto sekaligus', 'Background konsisten di semua foto', 'Retouch & color grading', 'Resolusi tinggi'],
            },
            {
              name: 'Poles Abis',
              price: 'Rp130.000',
              period: 'per 10 foto',
              delivery: '3-5 hari',
              highlighted: true,
              save: 'Hemat Rp70.000',
              features: ['10 foto sekaligus', 'Background removal', 'Retouch & color grading lengkap', 'Resolusi tinggi', 'Revisi 1x/foto'],
            },
          ],
          revisiNote: 'Cocok banget buat foto formal, KTP, LinkedIn, dan lamaran kerja.',
        },
      ],
    },
    testimonials: {
      label: 'Kata Klien Kami',
      title: 'Kata Mereka yang Udah Coba',
      sub: 'Bukan endorsement berbayar. Ini cerita asli dari orang-orang yang udah percayain karyanya ke RHP Creatives.',
      items: [
        {
          initials: 'SR',
          name: 'Siti Rahma',
          role: 'Pengantin, Undangan Online',
          text: 'undangannya cantiik banget seriusan 😭❤️ semua tamu nanya buat dimana, gue langsung rekomenin RHP. prosesnya cepet, revisinya sabar. worth it parah!! makasii RHP 🥹',
          rating: 5,
        },
        {
          initials: 'BF',
          name: 'Bagas Firmanto',
          role: 'Owner Konveksi, Landing Page',
          text: 'Jujur awalnya ragu mau bikin landing page, takut ribet dan mahal. Eh ternyata prosesnya gampang banget, tinggal kasih brief langsung dieksekusi. Abis live, WA langsung rame. Gak nyangka sefektif ini beneran.',
          rating: 5,
        },
        {
          initials: 'KP',
          name: 'Kirana Putri',
          role: 'Content Creator, Desain Instagram',
          text: 'Udah lama ngerasa feed IG gue berantakan tapi bingung mulai dari mana. Pas cobain RHP, jujur responnya agak lama di awal (nunggu sekitar 2 jaman), tapi begitu hasilnya keluar.. aesthetic banget serius. Engagement naik dan skrg sering ada yg DM nanya siapa yg buat feed gue 😄',
          rating: 4,
        },
        {
          initials: 'DA',
          name: 'Dimas Ardiansyah',
          role: 'Mahasiswa, Edit Foto KTP',
          text: 'foto KTP lama gue literally horor show 😭 skrg abis dipoles sama RHP jadi keliatan normal akhirnya wkwkwk. recommended buat yg mau apply kerja atau urus berkas apapun!!',
          rating: 5,
        },
        {
          initials: 'RK',
          name: 'Reni Kusuma',
          role: 'UMKM Kuliner, Feed Instagram',
          text: 'Jualan online gue sempet stagnan padahal produknya udah enak. Ternyata masalahnya di konten.. abis pake jasa desain RHP, follower naik dan order masuk tiap hari. No cap ini investasi yg worth it banget buat bisnis kecil 👍',
          rating: 5,
        },
        {
          initials: 'FN',
          name: 'Fajar Nugroho',
          role: 'Event Organizer',
          text: 'Flyer dan banner event kita selalu ke RHP. Pengerjaan cepet, harga masuk akal, hasilnya gak pernah bikin kecewa. Udah langganan dari awal dan gak ada niat pindah 👌',
          rating: 5,
        },
        {
          initials: 'MS',
          name: 'Mutiara Salsabila',
          role: 'Keluarga Pengantin, Paket Sultan',
          text: 'Buat nikahan adek gue ambil paket Sultan. Hasilnya melebihi ekspektasi banget, ada galeri foto, musik latarnya bikin baper, animasinya mulus. Banyak tamu yg bilang undangannya fancy kayak undangan artis 😭✨ makasih banyak RHP!!',
          rating: 5,
        },
        {
          initials: 'RP',
          name: 'Rizky Pratama',
          role: 'Freelancer, Landing Page',
          text: 'Dari awal brief sampe revisi akhir prosesnya mulus. Mereka ngerti maunya gue walau gue jelasinnya agak gak jelas wkwk. Hasilnya profesional dan sesuai ekspektasi. Puas dan pasti balik lagi 👍',
          rating: 5,
        },
        {
          initials: 'AR',
          name: 'Ayu Ramadhani',
          role: 'Fresh Graduate, Edit Foto Lamaran',
          text: 'Pas mau apply kerja, foto formal gue jelek banget dan ga ada studio foto deket rumah. Abis diedit sama RHP, backgroundnya rapi, tampilannya bersih dan profesional. Alhamdulillah lolos interview dan HRD nya langsung pujiin foto gue 😄',
          rating: 5,
        },
        {
          initials: 'HW',
          name: 'Hendra Wijaya',
          role: 'Startup Founder, Feed Instagram',
          text: 'Desainnya bagus dan konsisten sama branding yg gue mau. Komunikasinya juga enak. Cuma response WA nya kadang agak slow kalau weekend. Tapi overall puas dan udah rekomenin ke beberapa temen.',
          rating: 4,
        },
      ],
    },
    cta: {
      label: 'Ayo Mulai!',
      title: 'Siap Tampil Kece di Dunia Digital?',
      sub: 'Konsultasi gratis, tanpa commitment. Ceritain kebutuhan kamu dan kita langsung gasken!',
      trust: ['Kualitas Terjamin', 'Pengerjaan Sat-Set', 'Revisi Included', 'Harga Transparan'],
    },
    footer: {
      tagline: 'Jasa Digital & Desain Kreatif · Sat-Set & Worth It',
      copy: '© 2026 RHP Creatives. Hak cipta dilindungi.',
    },
    about: {
      profileLabel: 'Profil',
      profileTitle: 'RHP Creatives',
      profileText:
        'RHP Creatives adalah jasa kreatif digital yang fokus pada layanan desain dan digital. Kita hadir buat bantu individu, UMKM, dan bisnis tampil profesional dan berkesan di dunia digital. Pendekatannya personal, komunikasinya enak, dan harganya gak bikin kantong bolong.',
      visionTitle: 'Visi',
      visionText:
        'Jadi mitra kreatif digital terpercaya yang bantu bisnis dan personal Indonesia tampil kece dan kompetitif di era digital.',
      missionTitle: 'Misi',
      missionText:
        'Kasih layanan digital dan desain berkualitas tinggi dengan harga terjangkau, pengerjaan cepat, dan pelayanan yang ramah supaya tiap klien ngerasa puas dan terlayani dengan baik.',
      whyLabel: 'Keunggulan',
      whyTitle: 'Kenapa Pilih Kami?',
      whyItems: [
        { title: 'Harga Gak Nguras Kantong', desc: 'Paket harga transparan yang cocok buat semua, dari UMKM sampai startup yang baru grow.' },
        { title: 'Pengerjaan Sat-Set', desc: 'Kita ngehargain waktu kamu. Tiap proyek dikerjain efisien tanpa ngorbanin kualitas.' },
        { title: 'Revisi Tanpa Drama', desc: 'Kepuasan kamu prioritas kita. Revisi udah termasuk di tiap paket, gak perlu khawatir.' },
        { title: 'Komunikasi yang Enak', desc: 'Tim kita selalu siap bales pertanyaan dan kebutuhan kamu dengan cepet dan ramah.' },
        { title: 'Desain Custom Beneran', desc: 'Gak ada template generik di sini. Tiap proyek dikerjain sesuai kebutuhan dan vibes unik kamu.' },
        { title: 'Kualitas Gak Kompromi', desc: 'Setiap output lewat proses quality check buat mastiin hasilnya selalu worth it.' },
      ],
      statsLabel: 'Dalam Angka',
      stats: [
        { num: '4+', label: 'Layanan Tersedia' },
        { num: '50+', label: 'Klien Terlayani' },
        { num: '100%', label: 'Kepuasan Klien' },
        { num: '24 Jam', label: 'Waktu Respons' },
      ],
    },
    promoBar: {
      text: '🔥 Early Bird 25% OFF — Cuma buat 20 klien pertama! Jangan sampe nyesel ya bestie',
      days: 'hari',
      hrs: 'jam',
      mins: 'menit',
      secs: 'detik',
    },
    earlyBirdPopup: {
      headline: 'Bestie, kamu dateng di waktu yang tepat! 🎉',
      sub: 'Early Bird promo lagi jalan nih — diskon 25% buat 20 klien pertama doang. No cap, ini real.',
      slotsLeft: 'slot tersisa',
      cta: 'Gasken Order Sekarang →',
      dismiss: 'Ntar dulu deh',
    },
    pricingBanner: {
      badge: '🔥 Early Bird Aktif',
      title: 'Diskon 25% Buat 20 Klien Pertama',
      sub: 'Harga di bawah belum termasuk diskon Early Bird. Segera order sebelum kehabisan!',
    },
    floatingBadge: {
      text: '🔥 Early Bird 25% OFF',
      sub: 'Cuma 20 slot',
    },
    claimPage: {
      title: 'Klaim Voucher Early Bird 🎉',
      sub: 'Diskon 25% khusus buat kamu. Klaim sekarang sebelum kehabisan!',
      slotsLeft: 'slot tersisa dari 20',
      formTitle: 'Isi Data Kamu',
      nameLabel: 'Nama Lengkap',
      emailLabel: 'Email',
      waLabel: 'Nomor WhatsApp',
      waPlaceholder: '08xxxxxxxxxx',
      serviceLabel: 'Layanan yang Diminati',
      serviceOptions: ['Undangan Online', 'Landing Page', 'Desain Instagram', 'Edit Foto', 'Paket Bundling'],
      submitBtn: 'Klaim Voucher Sekarang 🎉',
      submitting: 'Memproses...',
      successTitle: 'Yeay! Voucher Berhasil Diklaim! 🎊',
      successSub: 'Tunjukkan kode ini saat order via WhatsApp ke RHP Creatives.',
      voucherLabel: 'Kode Voucher Kamu',
      copyBtn: 'Salin Kode',
      copied: 'Tersalin!',
      shareWaBtn: 'Share via WhatsApp →',
      orderWaBtn: 'Order Sekarang via WhatsApp →',
      howTitle: 'Cara Pakai Voucher',
      howText: 'Hubungi RHP Creatives via WhatsApp, sebutkan layanan yang kamu mau, dan tunjukkan kode voucher ini. Diskon 25% langsung diterapkan!',
      alreadyTitle: 'Kamu Sudah Punya Voucher! 🎉',
      alreadySub: 'Voucher Early Bird kamu sudah aktif. Gunakan kode ini saat order.',
      claimedAtLabel: 'Diklaim pada',
      quotaFullTitle: 'Yah, Kuota Early Bird Habis 😢',
      quotaFullSub: 'Semua 20 slot Early Bird sudah terisi. Daftar waitlist dan kami kabari kalau ada slot terbuka atau promo berikutnya!',
      waitlistTitle: 'Daftar Waitlist',
      waitlistEmailLabel: 'Email',
      waitlistWaLabel: 'Nomor WhatsApp',
      waitlistWaPlaceholder: '08xxxxxxxxxx',
      waitlistSubmit: 'Daftar Waitlist',
      waitlistSuccess: 'Kamu sudah masuk waitlist! Kami akan kabari segera 🔔',
      loading: 'Memuat...',
    },
    promo: {
      earlyBird: {
        label: '⏳ Jangan Sampai Ketinggalan',
        title: 'Early Bird Spesial',
        discount: '25%',
        quota: '20 Klien Pertama',
        dp: 'DP 50%',
        desc: 'Diskon 25% untuk semua layanan, cuma buat 20 klien pertama. Yang dateng duluan, yang untung duluan. Berlaku 1 bulan sejak launch. DP minimal 50% saat konfirmasi.',
        badge: '🔥 PROMO AKTIF',
        cta: 'Klaim Sebelum Kehabisan →',
      },
      bundling: {
        label: 'Sayang Banget Kalo Dilewatin',
        title: 'Paket Bundling',
        sub: 'Gabungin beberapa layanan sekaligus dan hemat lebih banyak. Literally the smarter choice, why pay more?',
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
        label: 'Ajak Teman, Dapet Diskon',
        title: 'Program Referral',
        sub: 'Rekomendasiin RHP Creatives ke temen kamu dan kalian berdua langsung dapat diskon. Win-win banget!',
        referrerTitle: 'Kamu yang Ngajak',
        referrerDiscount: '15%',
        referrerDesc: 'Tiap temenmu order pertama lewat referral kamu, kamu langsung dapet diskon 15% untuk order berikutnya. Berlaku permanen.',
        inviteeTitle: 'Temen yang Diajak',
        inviteeDiscount: '10%',
        inviteeDesc: 'Temen yang kamu ajak dapet diskon 10% untuk order pertamanya. Auto happy, auto order. Berlaku permanen.',
        howTitle: 'Gimana Caranya?',
        steps: [
          'Hubungi kami dan minta kode referral unikmu',
          'Share ke temen yang butuh jasa kita',
          'Temenmu order pakai kode referral',
          'Diskon otomatis masuk buat kalian berdua',
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
      tabReferral: 'Referral & Stats',
      tabOrders: 'Order History',
      noOrders: "No orders yet. Let's place one!",
      orderDate: 'Date',
      orderStatus: 'Status',
      orderAmount: 'Amount',
      viewOrder: 'View Details',
      statusPending: 'Awaiting Payment',
      statusPaid: 'Paid',
      statusProcessing: 'Processing',
      statusCompleted: 'Completed',
      statusCancelled: 'Cancelled',
    },
    orderPage: {
      tag: '✦ Place an Order',
      title: 'Order RHP Creatives Services',
      sub: 'Pick a service, fill in your details, and pay instantly. Super easy!',
      step1: 'Choose Service',
      step2: 'Choose Package',
      step3: 'Your Info',
      step4: 'Voucher (Optional)',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      waLabel: 'WhatsApp Number',
      waPlaceholder: '08xxxxxxxxxx',
      notesLabel: 'Additional Notes',
      notesPlaceholder: 'Tell us what you need (optional)',
      voucherLabel: 'Voucher Code',
      voucherPlaceholder: 'EBIRD-XXXXX',
      voucherApply: 'Apply',
      voucherApplied: '✓ Voucher applied! 25% discount activated',
      voucherInvalid: '✗ Invalid voucher code',
      summaryLabel: 'Order Summary',
      originalPrice: 'Original price',
      discount: 'Early Bird Discount',
      total: 'Total',
      payBtn: 'Pay Now →',
      paying: 'Processing...',
      loginPrompt: 'Please login to continue with payment!',
      loginBtn: 'Login Now →',
      selectFirst: 'Select a service and package first',
      errorGeneral: 'Failed to create transaction. Please try again.',
    },
    orderSuccess: {
      title: 'Order Placed! 🎉',
      sub: "Your order is in. Our team will follow up via WhatsApp shortly.",
      orderIdLabel: 'Order ID',
      serviceLabel: 'Service',
      packageLabel: 'Package',
      amountLabel: 'Amount Paid',
      statusLabel: 'Status',
      statusPending: 'Awaiting Payment',
      statusPaid: 'Paid',
      statusProcessing: 'Processing',
      statusCompleted: 'Completed',
      statusCancelled: 'Cancelled',
      waBtn: 'Chat via WhatsApp →',
      homeBtn: 'Back to Home',
      orderHistoryBtn: 'View All Orders',
      notFoundTitle: 'Order Not Found',
      notFoundSub: "This order doesn't exist or you don't have access to it.",
    },
    adminOrders: {
      title: 'Admin — Order List',
      sub: 'Manage all incoming orders',
      filterAll: 'All',
      filterPending: 'Pending',
      filterPaid: 'Paid',
      filterProcessing: 'Processing',
      filterCompleted: 'Completed',
      filterCancelled: 'Cancelled',
      exportCsv: 'Export CSV',
      colId: 'Order ID',
      colCustomer: 'Customer',
      colService: 'Service',
      colAmount: 'Amount',
      colStatus: 'Status',
      colDate: 'Date',
      noOrders: 'No orders yet',
      updateStatus: 'Update Status',
      accessDenied: 'Access denied. You are not an admin.',
      loading: 'Loading...',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
    },
    hero: {
      tag: '✦ Digital & Creative Design Services',
      titleBefore: 'Look ',
      titleEm: 'Amazing',
      titleAfter: " Online? Let's Go!",
      sub: "RHP Creatives gets you from zero to polished: online invitations, landing pages, aesthetic IG feeds, and photo edits. Let's get it!",
      cta1: 'Start Now ↗',
      cta2: 'See Pricing →',
      stat1Label: 'Services Available',
      stat2Label: 'Fast Turnaround',
      stat3Label: 'Revisions Included',
      cardDesc: 'Invitation · Landing Page · IG Feed · Photo Edit',
      cardPrice: 'Starting from Rp20.000',
      cardBadge: '⚡ Early Bird 25% Off',
      cardSatisfaction: '100% Worth It, No Cap',
    },
    pageHero: {
      layananDigital: {
        label: 'Digital Services',
        title: 'Digital Solutions That Hit Different',
        sub: 'Online invitation or landing page, you talk and we build. The result? Straight-up impressive.',
      },
      layananDesain: {
        label: 'Design Services',
        title: 'Design That Makes People Stop Scrolling',
        sub: 'Aesthetic IG feed, clean photo edits. All in one place. Sit back, relax, results incoming.',
      },
      testimoni: {
        label: 'Testimonials',
        title: 'Real Talk from Real Clients',
        sub: "Not sponsored, not filtered. These are genuine experiences from RHP Creatives clients. See for yourself.",
      },
      promo: {
        label: 'Promos & Deals',
        title: 'Deals Too Good to Pass Up',
        sub: 'Save more with our Early Bird discount, Bundle Packages, and Referral Program.',
      },
      about: {
        label: 'About Us',
        title: "Hey, We're RHP Creatives 👋",
        sub: 'A young creative team obsessed with making cool stuff so your business looks professional in the digital world.',
      },
    },
    homeOverview: {
      label: 'Our Services',
      title: 'Want to Look Great Online?',
      sub: 'Two full service categories covering all your digital and design needs.',
      digitalTitle: 'Digital Services',
      digitalSub: 'Online invitations and landing pages that make people stop and look twice.',
      digitalItems: ['Online Invitation', 'Landing Page'],
      digitalCta: 'View Details & Pricing →',
      designTitle: 'Design Services',
      designSub: 'Aesthetic Instagram content and clean photo edits that keep you on point.',
      designItems: ['Instagram Design', 'Photo Editing'],
      designCta: 'View Details & Pricing →',
    },
    services: {
      label: 'What We Do',
      title: 'RHP Creatives Services',
      sub: 'From digital to design, we got you, we got quality, we got vibes.',
      headerCta: 'Free Consultation ↗',
      digitalLabel: '✦ Digital Services',
      designLabel: '✦ Design Services',
      digital: [
        {
          num: '01',
          name: 'Online Invitation',
          desc: "Wedding, birthday, or family gathering? Your online invitation will look premium. Just share the link and watch guests get impressed.",
          features: ['Personalized design for your vibe', 'Auto RSVP & countdown', 'Google Maps drop-in'],
        },
        {
          num: '02',
          name: 'Landing Page',
          desc: "Great product but no one's buying? The right landing page = more conversions, more DMs, happier wallet. Literally works!",
          features: ['Design that makes people click', 'Mobile-first, loads fast', 'One-tap WhatsApp button'],
        },
      ],
      design: [
        {
          num: '03',
          name: 'Instagram Design',
          desc: "A messy feed is a major red flag. Let's make your IG aesthetic, consistent, and impossible to stop scrolling through.",
          features: ['Feed, story & highlight covers', 'Consistent with your brand', 'Ready to upload'],
        },
        {
          num: '04',
          name: 'Photo Edit — Background Swap & ID Photo',
          desc: "Bad ID photo? Random background? No stress, we fix it all. Your photo will look clean and professional, for real.",
          features: ['Background swap', 'Clean up & polish your look', 'High-resolution output'],
        },
      ],
    },
    pricing: {
      label: 'Transparent Pricing',
      title: 'Service Packages & Pricing',
      sub: "Prices can be adjusted to your needs. Hit us up first if you have questions, it's free!",
      digitalLabel: '✦ Digital Services',
      designLabel: '✦ Design Services',
      note: '* All prices are estimates. Chat with us for a final quote tailored to your needs.',
      popularBadge: 'Most Popular ⚡',
      orderCta: 'Order Now →',
      consultCta: "Let's Chat →",
      digital: [
        {
          name: 'Online Invitation',
          tiers: [
            {
              name: 'Simple Invite',
              price: 'Rp79.000',
              period: 'per invitation',
              delivery: '1 day',
              features: ['Curated template that already looks great', 'Full event info, neat & tidy', 'Shareable invitation link'],
            },
            {
              name: 'Aesthetic Invite',
              price: 'Rp139.000',
              period: 'per invitation',
              delivery: '2 days',
              highlighted: true,
              features: ['Everything from Simple ✓', 'Online RSVP so guests confirm instantly', 'Countdown timer — hype it up!', 'Google Maps pin, no getting lost', '1x revision'],
            },
            {
              name: 'Sultan Invite',
              price: 'Rp219.000',
              period: 'per invitation',
              delivery: '3 days',
              features: ['Everything from Aesthetic ✓', 'Photo gallery for the memories', 'Background music that hits different', 'Smooth animation effects', '2x revisions'],
            },
          ],
          revisiNote: "Extra revision: Rp35.000/revision (still worth it tho!)",
        },
        {
          name: 'Landing Page',
          tiers: [
            {
              name: 'Chill Page',
              price: 'Rp299.000',
              period: 'per page',
              delivery: '2 days',
              features: ['1 page, clean & cool', 'Looks professional for real', 'WhatsApp button that gets clicked', 'Mobile-friendly, obviously'],
            },
            {
              name: 'Kece Page',
              price: 'Rp649.000',
              period: 'per page',
              delivery: '4 days',
              highlighted: true,
              features: ['Everything from Chill ✓', 'Contact form for serious inquiries', 'Responsive on all phones', '2x revisions'],
            },
            {
              name: 'Sultan Page',
              price: 'Rp1.099.000',
              period: 'per page',
              delivery: '5-7 days',
              features: ['Everything from Kece ✓', 'Smooth animations & transitions', 'Basic SEO so Google can find you', '3x revisions'],
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
              features: ['1 feed or story content', '1x revision included'],
            },
            {
              name: 'Starter Feed',
              price: 'Rp175.000',
              period: 'per 5 posts',
              delivery: '3-4 days',
              save: 'Save Rp25.000',
              features: ['5 feed & story content', 'Save vs. single price', '1x revision per content'],
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
              features: ['20 designs per month', 'Feed & story covered', 'Consistent tone & branding', '1x revision per content', 'Priority queue'],
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
              features: ['Background swap', 'Clean up appearance', 'JPG/PNG output, crisp & clean'],
            },
            {
              name: 'Full Polish',
              price: 'Rp75.000',
              period: 'per 5 photos',
              delivery: '2-3 days',
              save: 'Save Rp25.000',
              features: ['5 photos at once', 'Consistent background across all', 'Retouch & color grading', 'High resolution'],
            },
            {
              name: 'Max Polish',
              price: 'Rp130.000',
              period: 'per 10 photos',
              delivery: '3-5 days',
              highlighted: true,
              save: 'Save Rp70.000',
              features: ['10 photos at once', 'Background removal', 'Full retouch & color grading', 'High resolution', '1x revision/photo'],
            },
          ],
          revisiNote: 'Perfect for formal photos, ID cards, LinkedIn, and job applications.',
        },
      ],
    },
    testimonials: {
      label: 'What Our Clients Say',
      title: 'Real Talk from Real Clients',
      sub: "Not sponsored, not filtered. These are genuine experiences from people who trusted RHP Creatives with their work.",
      items: [
        {
          initials: 'SR',
          name: 'Siti Rahma',
          role: 'Bride, Online Invitation',
          text: "the invitation was stunning fr 😭❤️ literally every guest asked who made it and i immediately rec'd RHP. fast process, patient with revisions, worth every penny!!",
          rating: 5,
        },
        {
          initials: 'BF',
          name: 'Bagas Firmanto',
          role: 'Clothing Business Owner, Landing Page',
          text: "honestly was skeptical about getting a landing page, thought it'd be way too complicated. but the process was super smooth, just sent a brief and they handled everything. once it went live my WhatsApp blew up lol. didn't expect it to work that well",
          rating: 5,
        },
        {
          initials: 'KP',
          name: 'Kirana Putri',
          role: 'Content Creator, Instagram Design',
          text: "my ig feed was a total mess and i had no clue where to even start. gotta be honest the response was a bit slow at first (like 2 hours?), but the result.. actually aesthetic. engagement went up and now ppl DM me asking who does my feed 😄",
          rating: 4,
        },
        {
          initials: 'DA',
          name: 'Dimas Ardiansyah',
          role: 'Student, ID Photo Edit',
          text: "my old id photo was literally a horror show 😭 after RHP fixed it it finally looks normal lmao. highly rec for anyone needing a photo for job apps or any official docs!!",
          rating: 5,
        },
        {
          initials: 'RK',
          name: 'Reni Kusuma',
          role: 'F&B Seller, Instagram Feed',
          text: "my sales were stuck even tho my product is good. turns out it was the content.. after getting designs from RHP followers grew and orders started coming in everyday. no cap this is a real investment for small biz 👍",
          rating: 5,
        },
        {
          initials: 'FN',
          name: 'Fajar Nugroho',
          role: 'Event Organizer',
          text: "we always go to RHP for event flyers and banners. fast, fair price, results never disappoint. they're our go-to team and we're not changing that anytime soon 👌",
          rating: 5,
        },
        {
          initials: 'MS',
          name: 'Mutiara Salsabila',
          role: 'Family of the Bride, Sultan Package',
          text: "got the Sultan package for my sister's wedding and the result was beyond expectations. photo gallery, background music that actually hits, smooth animations. so many guests said it looked like a celeb wedding invite 😭✨ thank you RHP!!",
          rating: 5,
        },
        {
          initials: 'RP',
          name: 'Rizky Pratama',
          role: 'Freelancer, Landing Page',
          text: "from brief to final revision everything went smoothly. they understood what i wanted even when my explanation was all over the place lol. result was professional and exactly what i needed. will definitely be back 👍",
          rating: 5,
        },
        {
          initials: 'AR',
          name: 'Ayu Ramadhani',
          role: 'Fresh Grad, Job Application Photo',
          text: "needed a proper formal photo for job apps and no studio nearby. after RHP edited it the background was clean and it looked super professional. got the interview and HR actually complimented my photo, didn't expect that 😄",
          rating: 5,
        },
        {
          initials: 'HW',
          name: 'Hendra Wijaya',
          role: 'Startup Founder, Instagram Feed',
          text: "design quality is great, consistent with my brand direction. communication is easy too. only thing is WA response can be slow on weekends. but overall very satisfied and already referred a few friends",
          rating: 4,
        },
      ],
    },
    cta: {
      label: "Let's Get It!",
      title: 'Ready to Look Amazing Online?',
      sub: "Free consultation, zero commitment. Tell us what you need and we'll make it happen, fast.",
      trust: ['Quality Guaranteed', 'Fast Turnaround', 'Revisions Included', 'Transparent Pricing'],
    },
    footer: {
      tagline: 'Digital & Creative Design Services · Fast & Worth It',
      copy: '© 2026 RHP Creatives. All rights reserved.',
    },
    about: {
      profileLabel: 'Profile',
      profileTitle: 'RHP Creatives',
      profileText:
        "RHP Creatives is a digital creative service focused on design and digital solutions. We help individuals, SMEs, and businesses look professional and memorable in the digital world, with a personal approach, easy communication, and pricing that won't break the bank.",
      visionTitle: 'Vision',
      visionText:
        'To be a trusted digital creative partner that helps Indonesian businesses and individuals look professional and competitive in the digital era.',
      missionTitle: 'Mission',
      missionText:
        "Deliver high-quality digital and design services at affordable prices, with fast turnaround and friendly communication so every client feels genuinely satisfied.",
      whyLabel: 'Our Edge',
      whyTitle: 'Why Choose Us?',
      whyItems: [
        { title: "Pricing That Won't Hurt", desc: 'Transparent packages that work for everyone, from side hustles to growing startups.' },
        { title: 'Fast Turnaround', desc: "We respect your time. Every project is handled efficiently without sacrificing quality." },
        { title: 'Revisions Without the Drama', desc: "Your satisfaction is the priority. Revisions are included in every package, no stress." },
        { title: 'Easy Communication', desc: 'Our team is always ready to respond quickly and warmly. No corporate nonsense.' },
        { title: 'Actually Custom Design', desc: "No generic templates here. Every project is built to match your unique needs and vibe." },
        { title: 'Quality That Slaps', desc: 'Every output goes through a quality check to make sure the result is always worth it.' },
      ],
      statsLabel: 'By the Numbers',
      stats: [
        { num: '4+', label: 'Services Available' },
        { num: '50+', label: 'Clients Served' },
        { num: '100%', label: 'Client Satisfaction' },
        { num: '24h', label: 'Response Time' },
      ],
    },
    promoBar: {
      text: "🔥 Early Bird 25% OFF — First 20 clients only! Don't sleep on this bestie",
      days: 'days',
      hrs: 'hrs',
      mins: 'mins',
      secs: 'secs',
    },
    earlyBirdPopup: {
      headline: 'Bestie, you came at the right time! 🎉',
      sub: 'Early Bird promo is live — 25% off for the first 20 clients only. No cap, this is real.',
      slotsLeft: 'slots left',
      cta: 'Order Now →',
      dismiss: 'Maybe later',
    },
    pricingBanner: {
      badge: '🔥 Early Bird Active',
      title: '25% Off for the First 20 Clients',
      sub: "Prices below don't include the Early Bird discount. Order before slots run out!",
    },
    floatingBadge: {
      text: '🔥 Early Bird 25% OFF',
      sub: '20 slots only',
    },
    claimPage: {
      title: 'Claim Your Early Bird Voucher 🎉',
      sub: '25% off just for you. Claim now before slots run out!',
      slotsLeft: 'slots remaining out of 20',
      formTitle: 'Fill in Your Details',
      nameLabel: 'Full Name',
      emailLabel: 'Email',
      waLabel: 'WhatsApp Number',
      waPlaceholder: '08xxxxxxxxxx',
      serviceLabel: 'Service You\'re Interested In',
      serviceOptions: ['Online Invitation', 'Landing Page', 'Instagram Design', 'Photo Editing', 'Bundle Package'],
      submitBtn: 'Claim Voucher Now 🎉',
      submitting: 'Processing...',
      successTitle: 'Woohoo! Voucher Claimed! 🎊',
      successSub: 'Show this code when ordering via WhatsApp to RHP Creatives.',
      voucherLabel: 'Your Voucher Code',
      copyBtn: 'Copy Code',
      copied: 'Copied!',
      shareWaBtn: 'Share via WhatsApp →',
      orderWaBtn: 'Order Now via WhatsApp →',
      howTitle: 'How to Use Your Voucher',
      howText: 'Contact RHP Creatives via WhatsApp, mention the service you want, and show this voucher code. Your 25% discount applies instantly!',
      alreadyTitle: 'You Already Have a Voucher! 🎉',
      alreadySub: 'Your Early Bird voucher is active. Use this code when ordering.',
      claimedAtLabel: 'Claimed on',
      quotaFullTitle: 'Early Bird Slots Are Full 😢',
      quotaFullSub: "All 20 Early Bird slots have been taken. Join the waitlist and we'll notify you when the next promo drops!",
      waitlistTitle: 'Join the Waitlist',
      waitlistEmailLabel: 'Email',
      waitlistWaLabel: 'WhatsApp Number',
      waitlistWaPlaceholder: '08xxxxxxxxxx',
      waitlistSubmit: 'Join Waitlist',
      waitlistSuccess: "You're on the waitlist! We'll notify you soon 🔔",
      loading: 'Loading...',
    },
    promo: {
      earlyBird: {
        label: "⏳ Don't Sleep on This",
        title: 'Early Bird Special',
        discount: '25%',
        quota: 'First 20 Clients',
        dp: '50% DP',
        desc: "25% off all services, but only for the first 20 clients. First come, first served. Valid for 1 month from launch. Minimum 50% down payment upon confirmation.",
        badge: '🔥 PROMO ACTIVE',
        cta: "Claim Before It's Gone →",
      },
      bundling: {
        label: 'Too Good to Pass Up',
        title: 'Bundle Packages',
        sub: 'Stack multiple services and save more. Literally the smarter choice, why pay full price?',
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
        label: 'Refer Friends, Get Discounts',
        title: 'Referral Program',
        sub: "Send your friend to RHP Creatives and you both get a discount. Win-win, no brainer.",
        referrerTitle: 'You (the One Who Shares)',
        referrerDiscount: '15%',
        referrerDesc: "Every time a friend makes their first order through your referral, you score a 15% discount on your next order. Valid permanently.",
        inviteeTitle: 'Your Friend (the Lucky One)',
        inviteeDiscount: '10%',
        inviteeDesc: "Your friend gets 10% off their first order at RHP Creatives. Auto happy. Valid permanently.",
        howTitle: 'How It Works',
        steps: [
          'Hit us up and get your unique referral code',
          'Share it with friends who need our services',
          'Your friend orders using your referral code',
          'Discounts hit for both of you automatically',
        ],
        cta: 'Get Referral Code →',
      },
    },
  },
}
