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
    customOrder: string
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
    errorEmailNotFound: string
    errorGoogleOnly: string
    errorWrongPassword: string
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
    referralCodeLabel: string
    referralCodePlaceholder: string
    referralCodeNote: string
    termsLink: string
    privacyLink: string
    termsError: string
  }
  profile: {
    referralLabel: string
    copyBtn: string
    copied: string
    shareNote: string
    shareWaBtn: string
    rewardLabel: string
    referrerTitle: string
    referrerDesc: string
    inviteeTitle: string
    inviteeDesc: string
    statsLabel: string
    statPeople: string
    statReward: string
    statsNote: string
    rewardsAvailableLabel: string
    rewardsAvailableDesc: string
    rewardsUsedLabel: string
    historyLabel: string
    historyEmpty: string
    historyUsedBy: string
    historyEarned: string
    howToLabel: string
    steps: string[]
    logoutBtn: string
    tabReferral: string
    tabOrders: string
    tabCustom: string
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
    earlyBirdLabel: string
    earlyBirdActive: string
    earlyBirdUsed: string
    earlyBirdAutoDiscount: string
    waLabel: string
    waEmpty: string
    waEdit: string
    waSave: string
    waCancel: string
    waSaving: string
    waSaved: string
    waInvalid: string
    noActiveDiscounts: string
    historyJoined: string
    historyOrdered: string
    orderNowBtn: string
    customReqStatuses: Record<string, string>
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
    discountSectionTitle: string
    discountAutoReferrer: string
    discountAutoReferrerBadge: string
    discountAutoInvitee: string
    discountAutoInviteeBadge: string
    discountManualLabel: string
    discountAutoEarlyBird: string
    discountAutoEarlyBirdBadge: string
    discountNone: string
    noDiscountsPromo: string
    noDiscountMsg: string
    voucherLabel: string
    voucherPlaceholder: string
    voucherApply: string
    voucherApplied: string
    voucherAppliedReferral: string
    voucherInvalid: string
    summaryLabel: string
    originalPrice: string
    discount: string
    discountReferral: string
    discountReferrerReward: string
    total: string
    payBtn: string
    paying: string
    loginPrompt: string
    loginBtn: string
    selectFirst: string
    errorGeneral: string
    confirmTitle: string
    confirmSub: string
    confirmGasken: string
    confirmWa: string
    waSavedBadge: string
    waChangeLink: string
    waWillSave: string
    payTermsNotice: string
    payTermsLink: string
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
  paymentPage: {
    title: string
    orderSummary: string
    orderIdLabel: string
    serviceLabel: string
    amountLabel: string
    expiryLabel: string
    tabBankTransfer: string
    tabEWallet: string
    tabQRIS: string
    tabCreditCard: string
    selectBank: string
    vaNumberLabel: string
    billerCodeLabel: string
    billKeyLabel: string
    copyBtn: string
    copied: string
    instructionsTitle: string
    bankInstructionsBCA: string[]
    bankInstructionsBNI: string[]
    bankInstructionsBRI: string[]
    bankInstructionsMandiri: string[]
    bankInstructionsPermata: string[]
    ewalletScanQR: string
    ewalletOrDeepLink: string
    ewalletOpenApp: string
    qrisTitle: string
    qrisSub: string
    ccTitle: string
    ccSub: string
    ccPayBtn: string
    loadingPayment: string
    errorCharge: string
    statusChecking: string
    expiredTitle: string
    expiredSub: string
    backToOrder: string
    countdownLabel: string
    notesLabel: string
    notesPlaceholder: string
    notesSaving: string
    notesSaved: string
    snapError: string
    closeBar: string
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
    viewPackageBtn: string
    orderNowBtn: string
    hotBadge: string
    viewAllBtn: string
  }
  serviceModal: {
    title: string
    sub: string
    digitalName: string
    digitalItems: string[]
    digitalTagline: string
    designName: string
    designItems: string[]
    designTagline: string
    unsure: string
    consultWa: string
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
  footer: { tagline: string; copy: string; terms: string; privacy: string }
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
    cta: string
  }
  floatingBadge: {
    text: string
    sub: string
  }
  firstLoginModal: {
    title: string
    sub: string
    referralLabel: string
    referralPlaceholder: string
    referralChecking: string
    referralValid: string
    referralInvalid: string
    termsLink: string
    privacyLink: string
    skipBtn: string
    saveBtn: string
    saving: string
  }
  claimPage: {
    title: string
    sub: string
    slotsLeft: string
    formTitle: string
    nameLabel: string
    emailLabel: string
    serviceLabel: string
    serviceOptions: string[]
    submitBtn: string
    submitting: string
    successTitle: string
    successSub: string
    expiryWarning: string
    expiresAtLabel: string
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
    expiredTitle: string
    expiredSub: string
    reclaimBtn: string
    quotaFullTitle: string
    quotaFullSub: string
    waitlistTitle: string
    waitlistEmailLabel: string
    waitlistWaLabel: string
    waitlistWaPlaceholder: string
    waitlistSubmit: string
    waitlistSuccess: string
    loading: string
    usedTitle: string
    usedSub: string
    usedOrderBtn: string
    historyBtn: string
    waLabel: string
    waSavedHint: string
    categories: string[]
    categoryLabel: string
    submitError: string
    submitErrorGeneral: string
    waFollowUpMsg: string
  }
  promo: {
    earlyBird: {
      label: string
      title: string
      discount: string
      quota: string
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
  servicePage: {
    digital: {
      ctaPrimary: string
      ctaSecondaryDesktop: string
      chips: string[]
    }
    design: {
      ctaPrimary: string
      ctaSecondaryDesktop: string
      chips: string[]
    }
    stickyBar: {
      label: string
      orderBtn: string
      consultBtn: string
      scrollBtn: string
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
      cta: 'Order Sekarang',
      login: 'Masuk',
      logout: 'Keluar',
      profileLink: 'Profil & Referral',
      customOrder: 'Custom Order',
    },
    auth: {
      loginTitle: 'Halo lagi, bestie!',
      loginSub: 'Login dulu, langsung bisa gasken order!',
      googleBtn: 'Lanjutkan dengan Google',
      googleConnecting: 'Menghubungkan...',
      orDivider: 'atau',
      emailLabel: 'Email',
      emailPlaceholder: 'kamu@email.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      submitLogin: 'Masuk',
      loggingIn: 'Masuk...',
      errorInvalid: 'Email atau password salah, coba lagi!',
      errorEmailNotFound: 'Email ini belum terdaftar. Daftar dulu yuk!',
      errorGoogleOnly: 'Akun ini terdaftar via Google. Pakai tombol "Masuk dengan Google" ya!',
      errorWrongPassword: 'Password salah. Coba lagi!',
      noAccount: 'Belum punya akun?',
      registerLink: 'Daftar sekarang',
      registerTitle: 'Gabung Yuk!',
      registerSub: 'Gratis dan gampang, langsung bisa order!',
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
      referralCodeLabel: 'Kode Referral (Opsional)',
      referralCodePlaceholder: 'RHP-XXXXX',
      referralCodeNote: 'Punya kode referral dari teman? Masukkan di sini dan dapat diskon 10% buat order pertama kamu!',
      termsLink: 'Syarat & Ketentuan',
      privacyLink: 'Kebijakan Privasi',
      termsError: 'Kamu harus setujui syarat & ketentuan dulu ya bestie!',
    },
    profile: {
      referralLabel: 'Kode Referral Kamu',
      copyBtn: 'Salin Kode',
      copied: 'Tersalin!',
      shareNote: 'Bagiin kode ini ke teman kamu. Mereka daftar pakai kode ini dan langsung dapat diskon 10% di order pertama. Kamu? Auto dapat diskon 15% setiap kali mereka order!',
      shareWaBtn: 'Bagiin ke Teman',
      rewardLabel: 'Reward Referral',
      referrerTitle: 'Kamu (yang ngajak)',
      referrerDesc: 'Dapat diskon 15% setiap kali orang yang kamu ajak order. Tanpa batas waktu, bisa dipakai berkali-kali. Gak ada expiry!',
      inviteeTitle: 'Teman kamu (yang diajak)',
      inviteeDesc: 'Dapat diskon 10% untuk order pertamanya. Gak ada batas waktu, langsung aktif begitu daftar!',
      statsLabel: 'Statistik Referral',
      statPeople: 'Teman yang bergabung',
      statReward: 'Total diskon didapat',
      statsNote: 'Statistik update otomatis setiap kali ada teman yang bergabung atau order',
      rewardsAvailableLabel: 'Reward Tersedia',
      rewardsAvailableDesc: 'Diskon 15% per reward, otomatis berlaku saat kamu order berikutnya',
      rewardsUsedLabel: 'Reward Terpakai',
      historyLabel: 'Riwayat Penggunaan',
      historyEmpty: 'Belum ada yang pakai kode referralmu. Bagiin ke teman yuk!',
      historyUsedBy: 'Dipakai oleh',
      historyEarned: 'Reward didapat',
      howToLabel: 'Cara Pakai Referral',
      steps: [
        'Salin kode referral kamu di atas',
        'Share ke teman kamu',
        'Temenmu daftar akun pakai kode ini di halaman register',
        'Mereka langsung dapat diskon 10%, kamu dapat diskon 15% tiap kali mereka order!',
      ],
      logoutBtn: 'Keluar',
      tabReferral: 'Referral & Reward',
      tabOrders: 'Riwayat Order',
      tabCustom: 'Request Custom',
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
      earlyBirdLabel: 'Early Bird',
      earlyBirdActive: 'Aktif ✅',
      earlyBirdUsed: 'Sudah Dipakai ✓',
      earlyBirdAutoDiscount: 'Diskon otomatis aktif saat checkout',
      waLabel: 'Nomor WhatsApp',
      waEmpty: 'Belum ditambahkan',
      waEdit: 'Edit',
      waSave: 'Simpan',
      waCancel: 'Batal',
      waSaving: 'Menyimpan...',
      waSaved: 'Nomor WA berhasil diperbarui ✅',
      waInvalid: 'Format nomor tidak valid (contoh: 08xx atau 628xx)',
      noActiveDiscounts: 'Belum ada diskon aktif. Ajak teman pakai kode referralmu untuk dapat diskon! 🎉',
      historyJoined: 'Teman bergabung menggunakan kode referralmu',
      historyOrdered: 'Teman melakukan order',
      orderNowBtn: 'Order Sekarang',
      customReqStatuses: {
        waiting_review: 'Menunggu Review',
        price_sent: 'Harga Dikirim',
        negotiating: 'Negosiasi',
        accepted: 'Diterima',
        payment_pending: 'Menunggu Bayar',
        paid: 'Dibayar',
        in_progress: 'Diproses',
        done: 'Selesai',
        rejected_by_admin: 'Ditolak Admin',
        rejected_by_customer: 'Ditolak Customer',
      },
    },
    orderPage: {
      tag: '✦ Pesan Layanan',
      title: 'Pesan Layanan RHP Creatives',
      sub: 'Pilih layanan, isi data, dan bayar langsung. Gampang banget!',
      step1: 'Pilih Layanan',
      step2: 'Pilih Paket',
      step3: 'Info Kamu',
      step4: 'Diskon & Voucher',
      nameLabel: 'Nama Lengkap',
      namePlaceholder: 'Nama kamu',
      emailLabel: 'Email',
      waLabel: 'Nomor WhatsApp',
      waPlaceholder: '08xxxxxxxxxx',
      notesLabel: 'Catatan Tambahan',
      notesPlaceholder: 'Tulis request khusus kamu di sini... (misal: tema warna, tanggal acara, nama yang mau dicantumkan, dll)',
      discountSectionTitle: 'Pilih Diskon',
      discountAutoReferrer: 'Reward Referral Kamu, diskon 15%',
      discountAutoReferrerBadge: '🎉 Tersedia',
      discountAutoInvitee: 'Diajak Teman, diskon 10%',
      discountAutoInviteeBadge: '✨ Berlaku',
      discountManualLabel: 'Punya kode voucher atau referral lain?',
      discountAutoEarlyBird: 'Early Bird, diskon 25%',
      discountAutoEarlyBirdBadge: '🔥 25% OFF',
      discountNone: 'Tanpa Diskon',
      noDiscountsPromo: 'Gasken Cek Promo',
      noDiscountMsg: 'Yah, kamu belum punya diskon nih 😅',
      voucherLabel: 'Masukkan Kode',
      voucherPlaceholder: 'EBIRD-XXXXX atau RHP-XXXXX',
      voucherApply: 'Terapkan',
      voucherApplied: '✓ Voucher Early Bird berhasil! Diskon 25% diterapkan',
      voucherAppliedReferral: '✓ Kode referral berhasil! Diskon 10% diterapkan',
      voucherInvalid: '✗ Kode voucher tidak valid',
      summaryLabel: 'Ringkasan Order',
      originalPrice: 'Harga asli',
      discount: 'Diskon Early Bird',
      discountReferral: 'Diskon Referral (Diajak)',
      discountReferrerReward: 'Reward Referral (15%)',
      total: 'Total Bayar',
      payBtn: 'Bayar Sekarang',
      paying: 'Memproses...',
      loginPrompt: 'Login dulu buat lanjut bayar ya!',
      loginBtn: 'Login Sekarang',
      selectFirst: 'Pilih layanan dan paket dulu',
      errorGeneral: 'Gagal membuat transaksi. Coba lagi.',
      confirmTitle: 'Cek dulu ya, bestie! ✨',
      confirmSub: 'Siap diproses! Kalau ada pertanyaan soal layanan ini, kamu bisa konsultasi dulu via WA sebelum bayar. Atau langsung gasken bayar sekarang, kamu tetap bisa tulis catatan/request di halaman pembayaran ya! 📝',
      confirmGasken: 'Langsung Gasken Bayar 🚀',
      confirmWa: 'Konsultasi Dulu via WA 💬',
      waSavedBadge: '✓ Tersimpan',
      waChangeLink: 'Bukan nomor ini? Ganti',
      waWillSave: 'Nomor ini akan disimpan untuk order berikutnya 💾',
      payTermsNotice: 'Dengan melanjutkan pembayaran, kamu menyetujui',
      payTermsLink: 'Syarat & Ketentuan',
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
      waBtn: 'Hubungi CS untuk Follow Up',
      homeBtn: 'Kembali ke Beranda',
      orderHistoryBtn: 'Lihat Semua Order',
      notFoundTitle: 'Order Tidak Ditemukan',
      notFoundSub: 'Order dengan ID ini tidak ada atau kamu tidak punya akses.',
    },
    paymentPage: {
      title: 'Pilih Metode Pembayaran',
      orderSummary: 'Ringkasan Order',
      orderIdLabel: 'Order ID',
      serviceLabel: 'Layanan',
      amountLabel: 'Total Bayar',
      expiryLabel: 'Batas Bayar',
      tabBankTransfer: 'Transfer Bank',
      tabEWallet: 'E-Wallet',
      tabQRIS: 'QRIS',
      tabCreditCard: 'Kartu Kredit',
      selectBank: 'Pilih Bank',
      vaNumberLabel: 'Nomor Virtual Account',
      billerCodeLabel: 'Kode Biller',
      billKeyLabel: 'Kode Bayar',
      copyBtn: 'Salin',
      copied: 'Tersalin!',
      instructionsTitle: 'Cara Bayar',
      bankInstructionsBCA: [
        'Buka aplikasi BCA mobile atau ATM BCA',
        'Pilih menu Transfer → ke BCA Virtual Account',
        'Masukkan nomor Virtual Account di atas',
        'Konfirmasi jumlah dan selesaikan pembayaran',
      ],
      bankInstructionsBNI: [
        'Buka aplikasi BNI mobile atau ATM BNI',
        'Pilih Transfer → Virtual Account',
        'Masukkan nomor Virtual Account di atas',
        'Ikuti instruksi dan selesaikan pembayaran',
      ],
      bankInstructionsBRI: [
        'Buka aplikasi BRImo atau ATM BRI',
        'Pilih Pembayaran → BRIVA',
        'Masukkan nomor Virtual Account di atas',
        'Konfirmasi dan selesaikan pembayaran',
      ],
      bankInstructionsMandiri: [
        'Buka aplikasi Mandiri Online atau ATM Mandiri',
        'Pilih Bayar → Multi Payment',
        'Masukkan Kode Biller di atas',
        'Masukkan Kode Bayar di atas',
        'Konfirmasi dan selesaikan pembayaran',
      ],
      bankInstructionsPermata: [
        'Buka aplikasi PermataMobile atau ATM Permata',
        'Pilih Pembayaran → Virtual Account',
        'Masukkan nomor Virtual Account di atas',
        'Konfirmasi dan selesaikan pembayaran',
      ],
      ewalletScanQR: 'Scan QR Code berikut',
      ewalletOrDeepLink: 'atau buka langsung di aplikasi',
      ewalletOpenApp: 'Buka di Aplikasi',
      qrisTitle: 'Scan QRIS',
      qrisSub: 'Scan dengan aplikasi dompet digital apapun yang mendukung QRIS',
      ccTitle: 'Kartu Kredit / Debit',
      ccSub: 'Bayar dengan kartu kredit atau debit visa/mastercard',
      ccPayBtn: 'Bayar dengan Kartu',
      loadingPayment: 'Memuat detail pembayaran...',
      errorCharge: 'Gagal memuat pembayaran. Coba lagi.',
      statusChecking: 'Mengecek status pembayaran...',
      expiredTitle: 'Waktu Bayar Habis',
      expiredSub: 'Waktu bayarnya udah habis nih. Bikin order baru yuk!',
      backToOrder: 'Buat Order Baru',
      countdownLabel: 'Sisa waktu bayar',
      notesLabel: 'Catatan / Request Kamu',
      notesPlaceholder: 'Tulis request khusus kamu di sini... (misal: tema warna, tanggal acara, nama yang mau dicantumkan, dll)',
      notesSaving: 'Menyimpan...',
      notesSaved: 'Tersimpan ✓',
      snapError: 'Aduh, payment widget-nya belum ready. Coba refresh ya!',
      closeBar: 'Tutup',
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
      cta1: 'Mulai Sekarang',
      cta2: 'Lihat Harga',
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
      digitalCta: 'Lihat Detail & Harga',
      designTitle: 'Layanan Desain',
      designSub: 'Desain Instagram estetis dan edit foto rapi untuk tampilan yang selalu on point.',
      designItems: ['Desain Instagram', 'Edit Foto'],
      designCta: 'Lihat Detail & Harga',
      viewPackageBtn: 'Lihat Paket',
      orderNowBtn: 'Order Sekarang',
      hotBadge: '🔥 Terlaris',
      viewAllBtn: 'Lihat Semua Paket & Harga',
    },
    serviceModal: {
      title: 'Mau bikin apa hari ini? 🔥',
      sub: 'Pilih layanan yang kamu butuhin, nanti kita gasken bareng!',
      digitalName: 'Layanan Digital',
      digitalItems: ['Undangan Online, mulai Rp79.000', 'Landing Page, mulai Rp299.000'],
      digitalTagline: 'Buat tampilan digitalmu makin exist!',
      designName: 'Layanan Desain',
      designItems: ['Desain Instagram, mulai Rp40.000', 'Edit Foto, mulai Rp20.000'],
      designTagline: 'Konten estetis yang bikin orang stop scroll!',
      unsure: 'Belum yakin mau yang mana?',
      consultWa: 'Konsultasi dulu via WA',
    },
    services: {
      label: 'Apa yang Kami Kerjain',
      title: 'Layanan RHP Creatives',
      sub: 'Dari digital sampai desain, semua ada, semua kece, semua worth it.',
      headerCta: 'Konsultasi Gratis',
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
          name: 'Edit Foto',
          desc: 'Foto KTP panik? Background foto asal-asalan? Tenang, kita beresin semuanya. Hasilnya foto kamu bakal keliatan profesional beneran.',
          features: ['Ganti background foto', 'Rapikan & poles tampilan', 'Output resolusi tinggi'],
        },
      ],
    },
    pricing: {
      label: 'Harga Transparan',
      title: 'Paket & Harga Layanan',
      sub: 'Harganya fleksibel, bisa disesuaiin sama bujet dan kebutuhanmu. Belum yakin? Konsultasi dulu aja, gratis!',
      digitalLabel: '✦ Layanan Digital',
      designLabel: '✦ Layanan Desain',
      note: '* Semua harga estimasi. Konsultasikan kebutuhan kamu buat harga final yang sesuai.',
      popularBadge: 'Paling Laku ⚡',
      orderCta: 'Pesan Sekarang',
      consultCta: 'Konsultasi Dulu',
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
              features: ['Semua dari Simpel ✓', 'Form RSVP online biar tamu konfirm langsung', 'Countdown timer, makin deg-degan!', 'Google Maps, anti nyasar', 'Revisi 1x'],
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
          name: 'Edit Foto',
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
      terms: 'Syarat & Ketentuan',
      privacy: 'Kebijakan Privasi',
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
      text: '🔥 Early Bird 25% OFF, cuma buat 20 klien pertama! Jangan sampe nyesel ya bestie',
      days: 'hari',
      hrs: 'jam',
      mins: 'menit',
      secs: 'detik',
    },
    earlyBirdPopup: {
      headline: 'Bestie, kamu dateng di waktu yang tepat! 🎉',
      sub: 'Promo lagi aktif nih! Gasken sebelum kehabisan bestie',
      slotsLeft: 'slot tersisa',
      cta: 'Gasken Order Sekarang',
      dismiss: 'Ntar dulu deh',
    },
    pricingBanner: {
      badge: '🔥 Early Bird Aktif',
      title: 'Diskon 25% Buat 20 Klien Pertama',
      sub: 'Harga di bawah belum termasuk diskon Early Bird. Segera order sebelum kehabisan!',
      cta: 'Klaim Sekarang',
    },
    floatingBadge: {
      text: '🔥 Early Bird 25% OFF',
      sub: 'Cuma 20 slot',
    },
    firstLoginModal: {
      title: 'Halo {name}! Selamat datang di RHP Creatives 🎉',
      sub: 'Punya kode referral? Masukkan sekarang dan langsung dapat diskon 10% buat order pertama kamu. Nanti gak bisa diinput lagi ya!',
      referralLabel: 'Kode Referral (Opsional)',
      referralPlaceholder: 'RHP-XXXXX',
      referralChecking: 'Mengecek...',
      referralValid: '✓ Kode valid! Diskon 10% siap buat kamu',
      referralInvalid: '✗ Kode tidak ditemukan',
      termsLink: 'Syarat & Ketentuan',
      privacyLink: 'Kebijakan Privasi',
      skipBtn: 'Batal / Logout',
      saveBtn: 'Mulai Gasken',
      saving: 'Menyimpan...',
    },
    claimPage: {
      title: 'Klaim Voucher Early Bird 🎉',
      sub: 'Diskon 25% khusus buat kamu. Klaim sekarang sebelum kehabisan!',
      slotsLeft: 'slot tersisa dari 20',
      formTitle: 'Isi Data Kamu',
      nameLabel: 'Nama Lengkap',
      emailLabel: 'Email',
      serviceLabel: 'Layanan yang Diminati',
      serviceOptions: ['Undangan Online', 'Landing Page', 'Desain Instagram', 'Edit Foto', 'Paket Bundling'],
      submitBtn: 'Klaim Voucher Sekarang 🎉',
      submitting: 'Memproses...',
      successTitle: 'Yeay, diskon aktif! 🎉',
      successSub: 'Diskon kamu otomatis aktif pas checkout nanti. Gasken order sekarang bestie!',
      expiryWarning: '⏰ Diskon ini hangus dalam 24 jam kalau belum dipakai. Gasken sekarang bestie!',
      expiresAtLabel: 'Berlaku sampai',
      voucherLabel: 'Kode Voucher Kamu',
      copyBtn: 'Salin Kode',
      copied: 'Tersalin!',
      shareWaBtn: 'Share via WhatsApp',
      orderWaBtn: 'Order Sekarang',
      howTitle: 'Cara Pakai Diskon',
      howText: 'Klik Order Sekarang, diskon kamu otomatis aktif di checkout. Gampang banget!',
      alreadyTitle: 'Diskon kamu masih aktif! 🔥',
      alreadySub: 'Diskon kamu otomatis aktif saat checkout. Tinggal order aja!',
      claimedAtLabel: 'Diklaim pada',
      expiredTitle: 'Voucher Kamu Hangus 😭',
      expiredSub: 'Sayang banget, voucher expired karena belum dipakai dalam 24 jam. Masih ada slot tersisa? Klaim ulang aja bestie!',
      reclaimBtn: 'Klaim Ulang Voucher',
      quotaFullTitle: 'Yah, Kuota Early Bird Habis 😢',
      quotaFullSub: 'Semua 20 slot Early Bird sudah terisi. Daftar waitlist dan kami kabari kalau ada slot terbuka!',
      waitlistTitle: 'Daftar Waitlist',
      waitlistEmailLabel: 'Email',
      waitlistWaLabel: 'Nomor WhatsApp',
      waitlistWaPlaceholder: '08xxxxxxxxxx',
      waitlistSubmit: 'Daftar Waitlist',
      waitlistSuccess: 'Kamu sudah masuk waitlist! Kami akan kabari segera 🔔',
      loading: 'Memuat...',
      usedTitle: 'Diskon Udah Kepake! 🎊',
      usedSub: 'Diskon kamu udah berhasil dipake di order sebelumnya. Hasilnya pasti worth it banget!',
      usedOrderBtn: 'Lihat Order Kamu',
      historyBtn: 'Lihat Riwayat',
      waLabel: 'Nomor WhatsApp (Opsional)',
      waSavedHint: 'Tersimpan',
      categories: ['Layanan Digital', 'Layanan Desain', 'Lainnya'],
      categoryLabel: 'Kategori Layanan',
      submitError: 'Oops, gagal kirim nih. Coba lagi dong!',
      submitErrorGeneral: 'Ada error nih. Coba lagi ya!',
      waFollowUpMsg: 'Halo RHP Creatives! Saya mau follow up order:',
    },
    promo: {
      earlyBird: {
        label: '⏳ Jangan Sampai Ketinggalan',
        title: 'Early Bird Spesial',
        discount: '25%',
        quota: '20 Klien Pertama',
        desc: 'Diskon 25% untuk semua layanan, cuma buat 20 klien pertama. Yang dateng duluan, yang untung duluan!',
        badge: '🔥 PROMO AKTIF',
        cta: 'Klaim Sebelum Kehabisan',
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
            name: 'Paket Konten Aesthetic',
            includes: 'Feed Aesthetic + Poles Banyak',
            price: 'Rp319.000',
            originalPrice: 'Rp374.000',
            save: 'Hemat Rp55.000',
          },
          {
            name: 'Paket Bisnis Gasken',
            includes: 'Halaman Kece + Feed Aesthetic',
            price: 'Rp799.000',
            originalPrice: 'Rp948.000',
            save: 'Hemat Rp149.000',
          },
        ],
        cta: 'Pesan Paket Bundling',
      },
      referral: {
        label: 'Ajak Teman, Dapet Diskon',
        title: 'Program Referral',
        sub: 'Rekomenin RHP Creatives ke temen kamu. Mereka daftar pakai kode referralmu di halaman register dan langsung dapat diskon 10%. Kamu? Dapat diskon 15% tiap kali mereka order. Tanpa batas waktu, no expiry!',
        referrerTitle: 'Kamu yang Ngajak',
        referrerDiscount: '15%',
        referrerDesc: 'Dapat diskon 15% setiap kali teman yang kamu ajak order. Tanpa batas waktu, bisa dipakai terus. No expiry!',
        inviteeTitle: 'Temen yang Diajak',
        inviteeDiscount: '10%',
        inviteeDesc: 'Temen yang kamu ajak dapet diskon 10% untuk order pertamanya. Auto happy, auto diskon. Gak ada expiry!',
        howTitle: 'Gimana Caranya?',
        steps: [
          'Login dan salin kode referralmu di halaman Profil',
          'Share ke temen yang butuh jasa kita',
          'Temenmu daftar akun di halaman register pakai kode referral kamu',
          'Mereka langsung dapat diskon 10%, kamu dapat diskon 15% tiap kali mereka order!',
        ],
        cta: 'Lihat Kode Referralmu',
      },
    },
    servicePage: {
      digital: {
        ctaPrimary: 'Lihat Paket & Harga',
        ctaSecondaryDesktop: 'Langsung Order',
        chips: ['💌 Undangan Online', '🚀 Landing Page'],
      },
      design: {
        ctaPrimary: 'Lihat Paket & Harga',
        ctaSecondaryDesktop: 'Langsung Order',
        chips: ['✨ Desain Instagram', '📸 Edit Foto'],
      },
      stickyBar: {
        label: 'Mau order?',
        orderBtn: 'Langsung Order 🚀',
        consultBtn: '💬 Konsultasi',
        scrollBtn: 'Lihat Paket',
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
      cta: 'Order Now',
      login: 'Sign In',
      logout: 'Sign Out',
      profileLink: 'Profile & Referral',
      customOrder: 'Custom Order',
    },
    auth: {
      loginTitle: 'Hey, welcome back bestie!',
      loginSub: 'Log in and start ordering!',
      googleBtn: 'Continue with Google',
      googleConnecting: 'Connecting...',
      orDivider: 'or',
      emailLabel: 'Email',
      emailPlaceholder: 'you@email.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      submitLogin: 'Sign In',
      loggingIn: 'Signing in...',
      errorInvalid: 'Wrong email or password, try again!',
      errorEmailNotFound: "This email isn't registered. Sign up first!",
      errorGoogleOnly: 'This account uses Google Sign-In. Use the "Sign in with Google" button.',
      errorWrongPassword: 'Wrong password. Try again!',
      noAccount: "Don't have an account?",
      registerLink: 'Register now',
      registerTitle: 'Join the Club!',
      registerSub: "Free and easy, let's go!",
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
      referralCodeLabel: 'Referral Code (Optional)',
      referralCodePlaceholder: 'RHP-XXXXX',
      referralCodeNote: "Got a referral code from a friend? Drop it here and get 10% off your first order!",
      termsLink: 'Terms & Conditions',
      privacyLink: 'Privacy Policy',
      termsError: "You gotta agree to the terms & conditions first bestie!",
    },
    profile: {
      referralLabel: 'Your Referral Code',
      copyBtn: 'Copy Code',
      copied: 'Copied!',
      shareNote: "Share this code with your friends. They sign up and instantly get 10% off their first order. You? Get 15% off every time they order. No expiry, no limits, forever.",
      shareWaBtn: 'Share with Friends',
      rewardLabel: 'Referral Rewards',
      referrerTitle: 'You (the one who shares)',
      referrerDesc: 'Get 15% off every time someone you invited places an order. No expiry, no limits. Works indefinitely!',
      inviteeTitle: 'Your friend (the lucky one)',
      inviteeDesc: 'Gets 10% off their first order. No expiry. The discount activates right when they sign up!',
      statsLabel: 'Referral Stats',
      statPeople: 'Friends who joined',
      statReward: 'Total discounts earned',
      statsNote: 'Stats update automatically whenever a friend joins or orders',
      rewardsAvailableLabel: 'Available Rewards',
      rewardsAvailableDesc: '15% discount per reward, applies automatically on your next order',
      rewardsUsedLabel: 'Rewards Used',
      historyLabel: 'Usage History',
      historyEmpty: "Nobody's used your referral code yet. Share it with your friends!",
      historyUsedBy: 'Used by',
      historyEarned: 'Reward earned',
      howToLabel: 'How to Use Referral',
      steps: [
        'Copy your referral code above',
        'Share it with a friend',
        'Your friend signs up with your code on the register page',
        'They get 10% off, you get 15% off every time they order!',
      ],
      logoutBtn: 'Sign Out',
      tabReferral: 'Referral & Rewards',
      tabOrders: 'Order History',
      tabCustom: 'Custom Requests',
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
      earlyBirdLabel: 'Early Bird',
      earlyBirdActive: 'Active ✅',
      earlyBirdUsed: 'Used ✓',
      earlyBirdAutoDiscount: 'Discount automatically applied at checkout',
      waLabel: 'WhatsApp Number',
      waEmpty: 'Not added yet',
      waEdit: 'Edit',
      waSave: 'Save',
      waCancel: 'Cancel',
      waSaving: 'Saving...',
      waSaved: 'WhatsApp number updated ✅',
      waInvalid: 'Invalid number format (e.g. 08xx or 628xx)',
      noActiveDiscounts: 'No active discounts. Invite friends with your referral code to earn discounts! 🎉',
      historyJoined: 'Friend joined using your referral code',
      historyOrdered: 'Friend placed an order',
      orderNowBtn: 'Order Now',
      customReqStatuses: {
        waiting_review: 'Waiting for Review',
        price_sent: 'Quote Sent',
        negotiating: 'Negotiating',
        accepted: 'Accepted',
        payment_pending: 'Awaiting Payment',
        paid: 'Paid',
        in_progress: 'In Progress',
        done: 'Done',
        rejected_by_admin: 'Rejected by Admin',
        rejected_by_customer: 'Declined by You',
      },
    },
    orderPage: {
      tag: '✦ Place an Order',
      title: 'Order RHP Creatives Services',
      sub: 'Pick a service, fill in your details, and pay instantly. Super easy!',
      step1: 'Choose Service',
      step2: 'Choose Package',
      step3: 'Your Info',
      step4: 'Discounts & Vouchers',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      waLabel: 'WhatsApp Number',
      waPlaceholder: '08xxxxxxxxxx',
      notesLabel: 'Additional Notes',
      notesPlaceholder: 'Add your special requests here... (e.g. color theme, event date, name to include, etc)',
      discountSectionTitle: 'Choose a Discount',
      discountAutoReferrer: 'Your Referral Reward, 15% off',
      discountAutoReferrerBadge: '🎉 Available',
      discountAutoInvitee: 'Referred by a Friend, 10% off',
      discountAutoInviteeBadge: '✨ Active',
      discountManualLabel: 'Have a voucher or another referral code?',
      discountAutoEarlyBird: 'Early Bird, 25% off',
      discountAutoEarlyBirdBadge: '🔥 25% OFF',
      discountNone: 'No Discount',
      noDiscountsPromo: 'Check Out Promos',
      noDiscountMsg: "Hmm, no discounts for you yet 😅",
      voucherLabel: 'Enter Code',
      voucherPlaceholder: 'EBIRD-XXXXX or RHP-XXXXX',
      voucherApply: 'Apply',
      voucherApplied: '✓ Early Bird voucher applied! 25% discount activated',
      voucherAppliedReferral: '✓ Referral code applied! 10% discount activated',
      voucherInvalid: '✗ Invalid voucher code',
      summaryLabel: 'Order Summary',
      originalPrice: 'Original price',
      discount: 'Early Bird Discount',
      discountReferral: 'Referral Discount (Invitee)',
      discountReferrerReward: 'Referral Reward (15%)',
      total: 'Total',
      payBtn: 'Pay Now',
      paying: 'Processing...',
      loginPrompt: 'Please login to continue with payment!',
      loginBtn: 'Login Now',
      selectFirst: 'Select a service and package first',
      errorGeneral: 'Failed to create transaction. Please try again.',
      confirmTitle: 'Double-check, bestie! ✨',
      confirmSub: "All set! Have questions about this service? You can consult via WA first, or go ahead and pay now. You can still add notes/requests on the payment page! 📝",
      confirmGasken: 'Pay Now! 🚀',
      confirmWa: 'Chat WA First 💬',
      waSavedBadge: '✓ Saved',
      waChangeLink: 'Not your number? Change',
      waWillSave: 'This number will be saved for future orders 💾',
      payTermsNotice: 'By proceeding with payment, you agree to our',
      payTermsLink: 'Terms & Conditions',
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
      waBtn: 'Contact CS for Follow Up',
      homeBtn: 'Back to Home',
      orderHistoryBtn: 'View All Orders',
      notFoundTitle: 'Order Not Found',
      notFoundSub: "This order doesn't exist or you don't have access to it.",
    },
    paymentPage: {
      title: 'Choose Payment Method',
      orderSummary: 'Order Summary',
      orderIdLabel: 'Order ID',
      serviceLabel: 'Service',
      amountLabel: 'Amount',
      expiryLabel: 'Pay Before',
      tabBankTransfer: 'Bank Transfer',
      tabEWallet: 'E-Wallet',
      tabQRIS: 'QRIS',
      tabCreditCard: 'Credit Card',
      selectBank: 'Select Bank',
      vaNumberLabel: 'Virtual Account Number',
      billerCodeLabel: 'Biller Code',
      billKeyLabel: 'Bill Key',
      copyBtn: 'Copy',
      copied: 'Copied!',
      instructionsTitle: 'How to Pay',
      bankInstructionsBCA: [
        'Open BCA mobile app or go to an ATM',
        'Select Transfer → BCA Virtual Account',
        'Enter the Virtual Account number above',
        'Confirm the amount and complete payment',
      ],
      bankInstructionsBNI: [
        'Open BNI mobile app or go to an ATM',
        'Select Transfer → Virtual Account',
        'Enter the Virtual Account number above',
        'Follow the instructions and complete payment',
      ],
      bankInstructionsBRI: [
        'Open BRImo app or go to a BRI ATM',
        'Select Payment → BRIVA',
        'Enter the Virtual Account number above',
        'Confirm and complete payment',
      ],
      bankInstructionsMandiri: [
        'Open Mandiri Online app or go to an ATM',
        'Select Pay → Multi Payment',
        'Enter the Biller Code above',
        'Enter the Bill Key above',
        'Confirm and complete payment',
      ],
      bankInstructionsPermata: [
        'Open PermataMobile app or go to an ATM',
        'Select Payment → Virtual Account',
        'Enter the Virtual Account number above',
        'Confirm and complete payment',
      ],
      ewalletScanQR: 'Scan the QR Code below',
      ewalletOrDeepLink: 'or open directly in the app',
      ewalletOpenApp: 'Open in App',
      qrisTitle: 'Scan QRIS',
      qrisSub: 'Scan with any digital wallet app that supports QRIS',
      ccTitle: 'Credit / Debit Card',
      ccSub: 'Pay with your Visa or Mastercard credit or debit card',
      ccPayBtn: 'Pay with Card',
      loadingPayment: 'Loading payment details...',
      errorCharge: 'Failed to load payment. Try again.',
      statusChecking: 'Checking payment status...',
      expiredTitle: 'Payment Time Expired',
      expiredSub: "The payment window has closed. Time to place a new order!",
      backToOrder: 'New Order',
      countdownLabel: 'Time remaining',
      notesLabel: 'Your Notes / Request',
      notesPlaceholder: 'Add your special requests here... (e.g. color theme, event date, name to include, etc)',
      notesSaving: 'Saving...',
      notesSaved: 'Saved ✓',
      snapError: 'Hmm, the payment widget is still loading. Try refreshing!',
      closeBar: 'Close',
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
      cta1: 'Start Now',
      cta2: 'See Pricing',
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
      digitalCta: 'View Details & Pricing',
      designTitle: 'Design Services',
      designSub: 'Aesthetic Instagram content and clean photo edits that keep you on point.',
      designItems: ['Instagram Design', 'Photo Editing'],
      designCta: 'View Details & Pricing',
      viewPackageBtn: 'View Packages',
      orderNowBtn: 'Order Now',
      hotBadge: '🔥 Trending',
      viewAllBtn: 'View All Packages & Pricing',
    },
    serviceModal: {
      title: 'What are we making today? 🔥',
      sub: "Pick what you need and let's get it done!",
      digitalName: 'Digital Services',
      digitalItems: ['Online Invitation, from Rp79.000', 'Landing Page, from Rp299.000'],
      digitalTagline: 'Make your digital presence shine!',
      designName: 'Design Services',
      designItems: ['Instagram Design, from Rp40.000', 'Photo Edit, from Rp20.000'],
      designTagline: 'Aesthetic content that makes people stop scrolling!',
      unsure: 'Not sure which one?',
      consultWa: 'Consult via WA first',
    },
    services: {
      label: 'What We Do',
      title: 'RHP Creatives Services',
      sub: 'From digital to design, we got you, we got quality, we got vibes.',
      headerCta: 'Free Consultation',
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
          name: 'Photo Edit',
          desc: "Bad ID photo? Random background? No stress, we fix it all. Your photo will look clean and professional, for real.",
          features: ['Background swap', 'Clean up & polish your look', 'High-resolution output'],
        },
      ],
    },
    pricing: {
      label: 'Transparent Pricing',
      title: 'Service Packages & Pricing',
      sub: "Prices are flexible, adjusted to your budget and needs. Not sure yet? Just hit us up, consultation is free!",
      digitalLabel: '✦ Digital Services',
      designLabel: '✦ Design Services',
      note: '* All prices are estimates. Chat with us for a final quote tailored to your needs.',
      popularBadge: 'Most Popular ⚡',
      orderCta: 'Order Now',
      consultCta: "Let's Chat",
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
              features: ['Everything from Simple ✓', 'Online RSVP so guests confirm instantly', 'Countdown timer, hype it up!', 'Google Maps pin, no getting lost', '1x revision'],
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
          name: 'Photo Edit',
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
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
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
      text: "🔥 Early Bird 25% OFF, first 20 clients only! Don't sleep on this bestie",
      days: 'days',
      hrs: 'hrs',
      mins: 'mins',
      secs: 'secs',
    },
    earlyBirdPopup: {
      headline: 'Bestie, you came at the right time! 🎉',
      sub: 'Promo is live! Grab your spot before it runs out bestie',
      slotsLeft: 'slots left',
      cta: 'Order Now',
      dismiss: 'Maybe later',
    },
    pricingBanner: {
      badge: '🔥 Early Bird Active',
      title: '25% Off for the First 20 Clients',
      sub: "Prices below don't include the Early Bird discount. Order before slots run out!",
      cta: 'Claim Now',
    },
    floatingBadge: {
      text: '🔥 Early Bird 25% OFF',
      sub: '20 slots only',
    },
    firstLoginModal: {
      title: 'Hey {name}! Welcome to RHP Creatives 🎉',
      sub: "Got a referral code? Enter it now and get 10% off your first order. You won't be able to add it later!",
      referralLabel: 'Referral Code (Optional)',
      referralPlaceholder: 'RHP-XXXXX',
      referralChecking: 'Checking...',
      referralValid: '✓ Code valid! 10% discount ready for you',
      referralInvalid: '✗ Code not found',
      termsLink: 'Terms & Conditions',
      privacyLink: 'Privacy Policy',
      skipBtn: 'Cancel / Logout',
      saveBtn: "Let's Go!",
      saving: 'Saving...',
    },
    claimPage: {
      title: 'Claim Your Early Bird Voucher 🎉',
      sub: '25% off just for you. Claim now before slots run out!',
      slotsLeft: 'slots remaining out of 20',
      formTitle: 'Fill in Your Details',
      nameLabel: 'Full Name',
      emailLabel: 'Email',
      serviceLabel: "Service You're Interested In",
      serviceOptions: ['Online Invitation', 'Landing Page', 'Instagram Design', 'Photo Editing', 'Bundle Package'],
      submitBtn: 'Claim Voucher Now 🎉',
      submitting: 'Processing...',
      successTitle: 'Discount activated! 🎉',
      successSub: "Your discount kicks in automatically at checkout. Let's go bestie!",
      expiryWarning: "⏰ This discount expires in 24 hours if not used. Don't sleep on it bestie!",
      expiresAtLabel: 'Valid until',
      voucherLabel: 'Your Voucher Code',
      copyBtn: 'Copy Code',
      copied: 'Copied!',
      shareWaBtn: 'Share via WhatsApp',
      orderWaBtn: 'Order Now',
      howTitle: 'How to Use Your Discount',
      howText: 'Click Order Now and your discount applies automatically at checkout. Super easy!',
      alreadyTitle: 'Your discount is still live! 🔥',
      alreadySub: 'Your discount applies automatically at checkout. Just order!',
      claimedAtLabel: 'Claimed on',
      expiredTitle: 'Your Voucher Expired 😭',
      expiredSub: "Yikes! Your voucher expired because it wasn't used within 24 hours. Slots still available? Re-claim it bestie!",
      reclaimBtn: 'Re-claim Voucher',
      quotaFullTitle: 'Early Bird Slots Are Full 😢',
      quotaFullSub: "All 20 Early Bird slots have been taken. Join the waitlist and we'll notify you when a slot opens up!",
      waitlistTitle: 'Join the Waitlist',
      waitlistEmailLabel: 'Email',
      waitlistWaLabel: 'WhatsApp Number',
      waitlistWaPlaceholder: '08xxxxxxxxxx',
      waitlistSubmit: 'Join Waitlist',
      waitlistSuccess: "You're on the waitlist! We'll notify you soon 🔔",
      loading: 'Loading...',
      usedTitle: 'Discount already used! 🎊',
      usedSub: "Your discount was used in a previous order. Bet the results are totally worth it!",
      usedOrderBtn: 'View Your Orders',
      historyBtn: 'View History',
      waLabel: 'WhatsApp Number (Optional)',
      waSavedHint: 'Saved',
      categories: ['Digital Services', 'Design Services', 'Other'],
      categoryLabel: 'Service Category',
      submitError: 'Oops, submission failed. Try again!',
      submitErrorGeneral: 'Something went wrong. Give it another shot!',
      waFollowUpMsg: 'Hi RHP Creatives! I want to follow up on my order:',
    },
    promo: {
      earlyBird: {
        label: "⏳ Don't Sleep on This",
        title: 'Early Bird Special',
        discount: '25%',
        quota: 'First 20 Clients',
        desc: "25% off all services, but only for the first 20 clients. First come, first served!",
        badge: '🔥 PROMO ACTIVE',
        cta: "Claim Before It's Gone",
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
            name: 'Aesthetic Content Pack',
            includes: 'Aesthetic Feed + Full Polish',
            price: 'Rp319.000',
            originalPrice: 'Rp374.000',
            save: 'Save Rp55.000',
          },
          {
            name: 'Business Go Pack',
            includes: 'Kece Page + Aesthetic Feed',
            price: 'Rp799.000',
            originalPrice: 'Rp948.000',
            save: 'Save Rp149.000',
          },
        ],
        cta: 'Order Bundle Package',
      },
      referral: {
        label: 'Refer Friends, Get Discounts',
        title: 'Referral Program',
        sub: "Recommend RHP Creatives to your friends. They sign up with your referral code and instantly get 10% off their first order. You? Get 15% off every time they order. No expiry, no limits.",
        referrerTitle: 'You (the One Who Shares)',
        referrerDiscount: '15%',
        referrerDesc: "Get 15% off every time someone you invited places an order. No expiry, no limits. Works indefinitely!",
        inviteeTitle: 'Your Friend (the Lucky One)',
        inviteeDiscount: '10%',
        inviteeDesc: "Your friend gets 10% off their first order. No expiry. Discount activates right when they sign up!",
        howTitle: 'How It Works',
        steps: [
          'Login and copy your referral code from the Profile page',
          'Share it with friends who need our services',
          'Your friend signs up with your referral code on the register page',
          'They get 10% off, you get 15% off every time they order!',
        ],
        cta: 'See Your Referral Code',
      },
    },
    servicePage: {
      digital: {
        ctaPrimary: 'View Packages & Pricing',
        ctaSecondaryDesktop: 'Order Now',
        chips: ['💌 Online Invitation', '🚀 Landing Page'],
      },
      design: {
        ctaPrimary: 'View Packages & Pricing',
        ctaSecondaryDesktop: 'Order Now',
        chips: ['✨ Instagram Design', '📸 Photo Editing'],
      },
      stickyBar: {
        label: 'Ready to order?',
        orderBtn: 'Order Now 🚀',
        consultBtn: '💬 Consult',
        scrollBtn: 'View Packages',
      },
    },
  },
}
