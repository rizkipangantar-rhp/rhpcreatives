'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './privacy.module.css'

export default function PrivacyPage() {
  const { lang } = useLanguage()
  const isID = lang === 'id'

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>Legal</span>
          <h1 className={styles.title}>
            {isID ? 'Kebijakan Privasi' : 'Privacy Policy'}
          </h1>
          <p className={styles.meta}>
            {isID ? 'Terakhir diperbarui: Mei 2026' : 'Last updated: May 2026'}
          </p>
        </div>

        {/* Intro */}
        <div className={styles.intro}>
          {isID ? (
            <p>RHP Creatives berkomitmen untuk melindungi privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda ketika menggunakan layanan kami. Dengan menggunakan layanan kami, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini.</p>
          ) : (
            <p>RHP Creatives is committed to protecting your privacy. This policy explains how we collect, use, store, and protect your personal data when you use our services. By using our services, you agree to the practices described in this policy.</p>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>

          <div className={styles.section}>
            <h2><span>1.</span>{isID ? 'DATA YANG KAMI KUMPULKAN' : 'DATA WE COLLECT'}</h2>
            {isID ? (
              <>
                <p>Kami mengumpulkan beberapa kategori data untuk memberikan layanan yang optimal:</p>
                <div className={styles.tableWrap}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Jenis Data</th>
                      <th>Contoh</th>
                      <th>Kapan Dikumpulkan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Data Identitas</td>
                      <td>Nama lengkap</td>
                      <td>Saat registrasi / order</td>
                    </tr>
                    <tr>
                      <td>Data Kontak</td>
                      <td>Email, nomor WhatsApp</td>
                      <td>Saat registrasi / order</td>
                    </tr>
                    <tr>
                      <td>Data Transaksi</td>
                      <td>Layanan yang dipesan, jumlah bayar, status order</td>
                      <td>Saat melakukan order</td>
                    </tr>
                    <tr>
                      <td>Data Akun</td>
                      <td>Foto profil Google (jika login via Google), referral code</td>
                      <td>Saat registrasi</td>
                    </tr>
                    <tr>
                      <td>Data Teknis</td>
                      <td>Informasi browser, halaman yang dikunjungi</td>
                      <td>Otomatis saat menggunakan website</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </>
            ) : (
              <>
                <p>We collect several categories of data to provide optimal service:</p>
                <div className={styles.tableWrap}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Data Type</th>
                      <th>Examples</th>
                      <th>When Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Identity Data</td>
                      <td>Full name</td>
                      <td>Upon registration / order</td>
                    </tr>
                    <tr>
                      <td>Contact Data</td>
                      <td>Email, WhatsApp number</td>
                      <td>Upon registration / order</td>
                    </tr>
                    <tr>
                      <td>Transaction Data</td>
                      <td>Services ordered, payment amount, order status</td>
                      <td>When placing an order</td>
                    </tr>
                    <tr>
                      <td>Account Data</td>
                      <td>Google profile photo (if signing in via Google), referral code</td>
                      <td>Upon registration</td>
                    </tr>
                    <tr>
                      <td>Technical Data</td>
                      <td>Browser information, pages visited</td>
                      <td>Automatically while using the website</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>2.</span>{isID ? 'BAGAIMANA KAMI MENGGUNAKAN DATA' : 'HOW WE USE YOUR DATA'}</h2>
            {isID ? (
              <ul>
                <li>Memproses dan mengkonfirmasi order layanan yang Anda lakukan.</li>
                <li>Mengirimkan update status pengerjaan dan komunikasi terkait proyek Anda melalui email atau WhatsApp.</li>
                <li>Mengirimkan informasi promo, penawaran spesial, atau update layanan (dapat dinonaktifkan).</li>
                <li>Mengelola akun Anda, termasuk fitur referral dan reward.</li>
                <li>Meningkatkan kualitas layanan dan pengalaman pengguna di website kami.</li>
                <li>Memenuhi kewajiban hukum yang berlaku.</li>
              </ul>
            ) : (
              <ul>
                <li>Processing and confirming your service orders.</li>
                <li>Sending progress updates and project-related communications via email or WhatsApp.</li>
                <li>Sending promotional information, special offers, or service updates (can be opted out).</li>
                <li>Managing your account, including referral and reward features.</li>
                <li>Improving our service quality and user experience on our website.</li>
                <li>Complying with applicable legal obligations.</li>
              </ul>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>3.</span>{isID ? 'KEAMANAN DATA' : 'DATA SECURITY'}</h2>
            {isID ? (
              <>
                <p>Kami menggunakan langkah-langkah keamanan teknis yang sesuai untuk melindungi data Anda:</p>
                <ul className={styles.defList}>
                  <li><strong>Upstash Redis</strong><span className={styles.defDesc}>Data pengguna disimpan di Upstash Redis, layanan database cloud dengan enkripsi data in-transit (TLS) dan at-rest.</span></li>
                  <li><strong>Password hashing</strong><span className={styles.defDesc}>Password akun dienkripsi menggunakan bcrypt dengan salt factor 12 sebelum disimpan. Kami tidak pernah menyimpan password dalam bentuk plaintext.</span></li>
                  <li><strong>HTTPS</strong><span className={styles.defDesc}>Semua komunikasi antara browser Anda dan server kami dienkripsi menggunakan HTTPS/TLS.</span></li>
                  <li><strong>NextAuth.js</strong><span className={styles.defDesc}>Autentikasi dikelola menggunakan NextAuth.js dengan strategi JWT yang aman.</span></li>
                  <li><strong>Midtrans</strong><span className={styles.defDesc}>Data kartu pembayaran diproses langsung oleh Midtrans (PCI-DSS compliant). Kami tidak menyimpan data kartu pembayaran Anda.</span></li>
                </ul>
                <p>Meskipun kami menerapkan praktik keamanan terbaik, tidak ada sistem yang 100% aman. Kami mendorong Anda untuk menggunakan password yang kuat dan tidak membagikan kredensial akun Anda.</p>
              </>
            ) : (
              <>
                <p>We use appropriate technical security measures to protect your data:</p>
                <ul className={styles.defList}>
                  <li><strong>Upstash Redis</strong><span className={styles.defDesc}>User data is stored in Upstash Redis, a cloud database service with in-transit (TLS) and at-rest encryption.</span></li>
                  <li><strong>Password hashing</strong><span className={styles.defDesc}>Account passwords are encrypted using bcrypt with a salt factor of 12 before storage. We never store passwords in plaintext.</span></li>
                  <li><strong>HTTPS</strong><span className={styles.defDesc}>All communication between your browser and our servers is encrypted via HTTPS/TLS.</span></li>
                  <li><strong>NextAuth.js</strong><span className={styles.defDesc}>Authentication is managed using NextAuth.js with a secure JWT strategy.</span></li>
                  <li><strong>Midtrans</strong><span className={styles.defDesc}>Payment card data is processed directly by Midtrans (PCI-DSS compliant). We do not store your payment card data.</span></li>
                </ul>
                <p>While we implement best security practices, no system is 100% secure. We encourage you to use a strong password and not share your account credentials.</p>
              </>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>4.</span>{isID ? 'HAK PENGGUNA' : 'YOUR RIGHTS'}</h2>
            {isID ? (
              <>
                <p>Anda memiliki hak atas data pribadi Anda. Anda dapat menghubungi kami untuk:</p>
                <ul className={styles.defList}>
                  <li><strong>Mengakses data</strong><span className={styles.defDesc}>Meminta salinan data pribadi yang kami simpan tentang Anda.</span></li>
                  <li><strong>Memperbarui data</strong><span className={styles.defDesc}>Memperbarui nama atau nomor WhatsApp Anda langsung melalui halaman profil, atau menghubungi kami untuk perubahan lainnya.</span></li>
                  <li><strong>Menghapus data</strong><span className={styles.defDesc}>Meminta penghapusan akun dan semua data pribadi Anda. Permintaan ini akan diproses dalam 7 hari kerja. Data transaksi yang sudah selesai dapat tetap disimpan untuk keperluan hukum.</span></li>
                  <li><strong>Portabilitas data</strong><span className={styles.defDesc}>Meminta ekspor data Anda dalam format yang dapat dibaca mesin.</span></li>
                  <li><strong>Opt-out komunikasi promo</strong><span className={styles.defDesc}>Berhenti menerima email atau pesan promo kapan saja dengan menghubungi kami.</span></li>
                </ul>
                <p>Untuk menggunakan hak-hak ini, silakan hubungi kami melalui email atau WhatsApp yang tersedia di bawah.</p>
              </>
            ) : (
              <>
                <p>You have rights over your personal data. You may contact us to:</p>
                <ul className={styles.defList}>
                  <li><strong>Access data</strong><span className={styles.defDesc}>Request a copy of the personal data we hold about you.</span></li>
                  <li><strong>Update data</strong><span className={styles.defDesc}>Update your name or WhatsApp number directly through the profile page, or contact us for other changes.</span></li>
                  <li><strong>Delete data</strong><span className={styles.defDesc}>Request deletion of your account and all personal data. This will be processed within 7 business days. Completed transaction data may be retained for legal purposes.</span></li>
                  <li><strong>Data portability</strong><span className={styles.defDesc}>Request an export of your data in a machine-readable format.</span></li>
                  <li><strong>Opt-out of promo communications</strong><span className={styles.defDesc}>Stop receiving promotional emails or messages at any time by contacting us.</span></li>
                </ul>
                <p>To exercise these rights, please contact us via the email or WhatsApp listed below.</p>
              </>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>5.</span>{isID ? 'BERBAGI DATA DENGAN PIHAK KETIGA' : 'THIRD-PARTY DATA SHARING'}</h2>
            {isID ? (
              <>
                <p>RHP Creatives tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Data Anda hanya dapat dibagikan dalam kondisi terbatas berikut:</p>
                <ul className={styles.defList}>
                  <li><strong>Midtrans</strong><span className={styles.defDesc}>Penyedia payment gateway untuk memproses transaksi pembayaran Anda secara aman.</span></li>
                  <li><strong>Google</strong><span className={styles.defDesc}>Jika Anda memilih login via Google, Google mengautentikasi identitas Anda sesuai kebijakan privasi Google.</span></li>
                  <li><strong>Upstash</strong><span className={styles.defDesc}>Penyedia infrastruktur database yang menyimpan data akun dan transaksi Anda.</span></li>
                  <li><strong>Kewajiban hukum</strong><span className={styles.defDesc}>Jika diwajibkan oleh hukum atau perintah pengadilan yang berlaku di Indonesia.</span></li>
                </ul>
              </>
            ) : (
              <>
                <p>RHP Creatives does not sell or rent your personal data to third parties. Your data may only be shared under the following limited circumstances:</p>
                <ul className={styles.defList}>
                  <li><strong>Midtrans</strong><span className={styles.defDesc}>Payment gateway provider for securely processing your payment transactions.</span></li>
                  <li><strong>Google</strong><span className={styles.defDesc}>If you choose to log in via Google, Google authenticates your identity per Google&apos;s privacy policy.</span></li>
                  <li><strong>Upstash</strong><span className={styles.defDesc}>Database infrastructure provider that stores your account and transaction data.</span></li>
                  <li><strong>Legal obligation</strong><span className={styles.defDesc}>If required by law or court order applicable in Indonesia.</span></li>
                </ul>
              </>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>6.</span>{isID ? 'KEBIJAKAN COOKIE' : 'COOKIE POLICY'}</h2>
            {isID ? (
              <>
                <p>Website kami menggunakan cookie dan teknologi penyimpanan lokal serupa untuk meningkatkan pengalaman pengguna:</p>
                <ul className={styles.defList}>
                  <li><strong>Cookie sesi</strong><span className={styles.defDesc}>Menyimpan status login Anda agar tidak perlu login ulang setiap kali membuka halaman.</span></li>
                  <li><strong>localStorage</strong><span className={styles.defDesc}>Menyimpan preferensi bahasa (ID/EN), status Early Bird popup, dan preferensi tampilan lainnya secara lokal di browser Anda.</span></li>
                  <li><strong>Cookie analitik</strong><span className={styles.defDesc}>Kami menggunakan data kunjungan halaman secara anonim untuk memahami bagaimana pengguna berinteraksi dengan website kami.</span></li>
                </ul>
                <p>Anda dapat menghapus cookie dan data penyimpanan lokal kapan saja melalui pengaturan browser Anda. Namun, ini dapat mempengaruhi fungsionalitas website termasuk status login Anda.</p>
              </>
            ) : (
              <>
                <p>Our website uses cookies and similar local storage technologies to enhance user experience:</p>
                <ul className={styles.defList}>
                  <li><strong>Session cookies</strong><span className={styles.defDesc}>Store your login state so you don&apos;t need to log in again each time you open a page.</span></li>
                  <li><strong>localStorage</strong><span className={styles.defDesc}>Stores language preferences (ID/EN), Early Bird popup status, and other display preferences locally in your browser.</span></li>
                  <li><strong>Analytics cookies</strong><span className={styles.defDesc}>We use anonymous page visit data to understand how users interact with our website.</span></li>
                </ul>
                <p>You can delete cookies and local storage data at any time through your browser settings. However, this may affect website functionality including your login status.</p>
              </>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>7.</span>{isID ? 'RETENSI DATA' : 'DATA RETENTION'}</h2>
            {isID ? (
              <p>Kami menyimpan data Anda selama akun Anda aktif atau selama diperlukan untuk memberikan layanan. Data transaksi yang sudah selesai disimpan selama minimal 1 tahun untuk keperluan pencatatan dan hukum. Jika Anda meminta penghapusan akun, data pribadi identifikasi akan dihapus dalam 7 hari kerja, namun catatan transaksi anonim dapat tetap disimpan.</p>
            ) : (
              <p>We retain your data for as long as your account is active or as needed to provide our services. Completed transaction data is retained for at least 1 year for record-keeping and legal purposes. If you request account deletion, identifying personal data will be deleted within 7 business days, though anonymous transaction records may be retained.</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>8.</span>{isID ? 'PERUBAHAN KEBIJAKAN' : 'POLICY CHANGES'}</h2>
            {isID ? (
              <p>RHP Creatives dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan akan dikomunikasikan melalui email atau notifikasi di website. Versi terbaru selalu tersedia di halaman ini dengan tanggal pembaruan. Penggunaan layanan kami setelah perubahan berlaku berarti Anda menyetujui kebijakan yang diperbarui.</p>
            ) : (
              <p>RHP Creatives may update this privacy policy from time to time. Significant changes will be communicated via email or website notification. The most current version is always available on this page with the update date. Continued use of our services after changes take effect constitutes acceptance of the updated policy.</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>9.</span>{isID ? 'HUBUNGI KAMI' : 'CONTACT US'}</h2>
            <div className={styles.contactBox}>
              {isID ? (
                <>
                  <p>Untuk pertanyaan terkait privasi, permintaan data, atau pelaporan masalah keamanan, hubungi kami melalui:</p>
                  <p>Email: <a href="mailto:rhpcreativesid@gmail.com">rhpcreativesid@gmail.com</a></p>
                  <p>WhatsApp: <a href="https://wa.me/6285179992598" target="_blank" rel="noopener noreferrer">+62 851 7999 2598</a></p>
                  <p>Kami berkomitmen untuk merespons pertanyaan terkait privasi dalam 3 hari kerja.</p>
                </>
              ) : (
                <>
                  <p>For privacy questions, data requests, or reporting security issues, contact us through:</p>
                  <p>Email: <a href="mailto:rhpcreativesid@gmail.com">rhpcreativesid@gmail.com</a></p>
                  <p>WhatsApp: <a href="https://wa.me/6285179992598" target="_blank" rel="noopener noreferrer">+62 851 7999 2598</a></p>
                  <p>We are committed to responding to privacy-related inquiries within 3 business days.</p>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Page Footer */}
        <div className={styles.pageFooter}>
          <p className={styles.legalNotice}>RHP Creatives © 2026. All Rights Reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/terms">{isID ? 'Syarat & Ketentuan' : 'Terms & Conditions'}</Link>
            <Link href="/">{isID ? 'Kembali ke Beranda' : 'Back to Home'}</Link>
          </div>
        </div>

      </div>
    </main>
  )
}
