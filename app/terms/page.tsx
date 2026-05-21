'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './terms.module.css'

export default function TermsPage() {
  const { lang } = useLanguage()
  const isID = lang === 'id'

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>Legal</span>
          <h1 className={styles.title}>
            {isID ? 'Syarat & Ketentuan' : 'Terms & Conditions'}
          </h1>
          <p className={styles.meta}>
            {isID ? 'Terakhir diperbarui: Mei 2026' : 'Last updated: May 2026'}
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>

          <div className={styles.section}>
            <h2><span>1.</span>{isID ? 'Ketentuan Penggunaan' : 'CONDITIONS OF USE'}</h2>
            {isID ? (
              <p>RHP Creatives menyediakan layanan jasa digital dan desain kepada Anda dengan syarat penerimaan semua ketentuan yang tercantum di sini. Dengan mengakses dan menggunakan website ini, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui salah satu ketentuan, harap hentikan penggunaan layanan kami.</p>
            ) : (
              <p>RHP Creatives provides digital and design services to you on the condition that you accept all the terms stated here. By accessing and using this website, you confirm that you have read, understood, and agreed to be bound by these terms and conditions. If you do not agree to any of these terms, please discontinue your use of our services.</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>2.</span>{isID ? 'Gambaran Umum' : 'OVERVIEW'}</h2>
            {isID ? (
              <p>Penggunaan website ini berarti Anda menyetujui semua syarat dan ketentuan yang berlaku. RHP Creatives berhak mengubah syarat dan ketentuan ini kapan saja. Versi terbaru akan selalu tersedia di halaman ini. Penggunaan berkelanjutan setelah perubahan berarti Anda menerima ketentuan yang diperbarui.</p>
            ) : (
              <p>Using this website means you accept all applicable terms and conditions. RHP Creatives reserves the right to modify these terms at any time. The most current version will always be available on this page. Continued use after changes constitutes acceptance of the updated terms.</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>3.</span>{isID ? 'Perubahan' : 'MODIFICATION'}</h2>
            {isID ? (
              <p>RHP Creatives berhak mengubah harga layanan, daftar layanan yang tersedia, dan ketentuan penggunaan sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan harga berlaku untuk order baru setelah tanggal perubahan. Order yang sudah dikonfirmasi dan dibayar tidak akan terpengaruh oleh perubahan harga.</p>
            ) : (
              <p>RHP Creatives reserves the right to modify service pricing, available service listings, and usage terms at any time without prior notice. Price changes apply to new orders placed after the date of the change. Already confirmed and paid orders will not be affected by price changes.</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>4.</span>{isID ? 'Hak Cipta' : 'COPYRIGHTS'}</h2>
            {isID ? (
              <>
                <p>Semua konten yang tersedia di website ini — termasuk namun tidak terbatas pada teks, grafis, logo, ikon, gambar, klip audio, unduhan digital, dan kompilasi data — adalah milik RHP Creatives dan dilindungi oleh hukum hak cipta yang berlaku di Indonesia.</p>
                <p>Hasil karya yang dibuat untuk klien menjadi milik klien sepenuhnya setelah pembayaran lunas sesuai ketentuan paket yang dipilih. RHP Creatives berhak menampilkan karya tersebut sebagai portofolio kecuali ada kesepakatan khusus.</p>
              </>
            ) : (
              <>
                <p>All content available on this website — including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and data compilations — is the property of RHP Creatives and protected by applicable copyright laws in Indonesia.</p>
                <p>Work created for clients becomes the client's full property upon complete payment as per the selected package terms. RHP Creatives reserves the right to display such work as portfolio unless a specific agreement states otherwise.</p>
              </>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>5.</span>{isID ? 'Daftar & Akun' : 'SIGN UP & ACCOUNT'}</h2>
            {isID ? (
              <>
                <p>Anda bertanggung jawab penuh untuk menjaga kerahasiaan akun dan password Anda. Semua aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya.</p>
                <p>Anda setuju untuk segera memberi tahu RHP Creatives jika terjadi akses tidak sah ke akun Anda. RHP Creatives tidak bertanggung jawab atas kerugian yang timbul akibat kelalaian Anda dalam menjaga keamanan akun.</p>
              </>
            ) : (
              <>
                <p>You are solely responsible for maintaining the confidentiality of your account and password. All activities that occur under your account are your sole responsibility.</p>
                <p>You agree to immediately notify RHP Creatives of any unauthorized access to your account. RHP Creatives is not responsible for losses arising from your failure to maintain account security.</p>
              </>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>6.</span>{isID ? 'Komunikasi Elektronik' : 'ELECTRONIC COMMUNICATIONS'}</h2>
            {isID ? (
              <p>Dengan mendaftar di RHP Creatives, Anda setuju untuk menerima komunikasi elektronik dari kami terkait layanan, update order, konfirmasi pembayaran, dan informasi promo. Anda dapat berhenti berlangganan dari komunikasi promosi kapan saja dengan menghubungi kami. Komunikasi terkait transaksi aktif tetap akan dikirimkan.</p>
            ) : (
              <p>By registering with RHP Creatives, you agree to receive electronic communications from us regarding services, order updates, payment confirmations, and promotional information. You may unsubscribe from promotional communications at any time by contacting us. Communications related to active transactions will continue to be sent.</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>7.</span>{isID ? 'DESKRIPSI LAYANAN' : 'SERVICE DESCRIPTION'}</h2>
            {isID ? (
              <>
                <p>RHP Creatives berusaha menampilkan informasi layanan, portofolio, dan estimasi pengerjaan seakurat dan selengkap mungkin. Namun, hasil akhir dari setiap proyek dapat bervariasi tergantung pada kebutuhan spesifik dan kualitas brief yang diberikan oleh klien.</p>
                <p>Estimasi waktu pengerjaan bersifat indikatif dan dapat berubah berdasarkan kompleksitas proyek dan waktu respons klien terhadap revisi atau persetujuan. RHP Creatives akan mengkomunikasikan setiap perubahan estimasi secara proaktif.</p>
              </>
            ) : (
              <>
                <p>RHP Creatives strives to present service information, portfolio, and delivery estimates as accurately and completely as possible. However, the final result of each project may vary depending on the specific requirements and the quality of the brief provided by the client.</p>
                <p>Delivery time estimates are indicative and may change based on project complexity and client response time on revisions or approvals. RHP Creatives will proactively communicate any changes to estimates.</p>
              </>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>8.</span>{isID ? 'KEBIJAKAN REVISI & PEMBATALAN' : 'REVISION & CANCELLATION POLICY'}</h2>
            {isID ? (
              <ul>
                <li>Revisi termasuk dalam paket sesuai dengan jumlah yang tertera pada paket yang dipilih.</li>
                <li>Revisi di luar jumlah yang tercantum dalam paket akan dikenakan biaya tambahan yang disepakati sebelumnya.</li>
                <li>Pembatalan order yang sudah dikonfirmasi dan dibayar tidak dapat direfund dalam kondisi apapun karena pengerjaan sudah dimulai.</li>
                <li>Pengerjaan dimulai setelah pembayaran dikonfirmasi oleh sistem. Progress pengerjaan akan dikomunikasikan melalui WhatsApp.</li>
                <li>Jika ada ketidakpuasan dengan hasil akhir, klien dapat menggunakan hak revisi yang tersedia sesuai paket sebelum project dinyatakan selesai.</li>
              </ul>
            ) : (
              <ul>
                <li>Revisions are included in the package as specified by the number stated in the selected package.</li>
                <li>Revisions beyond the number included in the package will incur an additional fee agreed upon in advance.</li>
                <li>Cancellation of confirmed and paid orders cannot be refunded under any circumstances as work has already begun.</li>
                <li>Work begins after payment is confirmed by the system. Progress will be communicated via WhatsApp.</li>
                <li>If unsatisfied with the final result, clients may use the available revision rights as per the package before the project is declared complete.</li>
              </ul>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>9.</span>{isID ? 'Kebijakan Privasi' : 'PRIVACY POLICY'}</h2>
            {isID ? (
              <>
                <p>Data pribadi Anda — termasuk nama, alamat email, dan nomor WhatsApp — hanya digunakan untuk keperluan pemrosesan order, komunikasi terkait layanan, dan peningkatan pengalaman pengguna.</p>
                <p>RHP Creatives tidak menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan komersial. Data dapat dibagikan kepada penyedia layanan teknis (seperti payment gateway Midtrans) hanya sebatas yang diperlukan untuk memproses transaksi Anda.</p>
                <p>Untuk informasi lengkap tentang cara kami mengelola data Anda, silakan baca <Link href="/privacy">Kebijakan Privasi</Link> kami.</p>
              </>
            ) : (
              <>
                <p>Your personal data — including your name, email address, and WhatsApp number — is used solely for order processing, service-related communications, and improving your user experience.</p>
                <p>RHP Creatives does not sell, rent, or share your personal data with third parties for commercial purposes. Data may be shared with technical service providers (such as the Midtrans payment gateway) only to the extent necessary to process your transactions.</p>
                <p>For full information on how we manage your data, please read our <Link href="/privacy">Privacy Policy</Link>.</p>
              </>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>10.</span>{isID ? 'Ganti Rugi' : 'INDEMNITY'}</h2>
            {isID ? (
              <p>Anda setuju untuk tidak menyalahgunakan layanan RHP Creatives untuk tujuan ilegal, menipu, atau yang merugikan pihak lain. Anda setuju untuk membebaskan RHP Creatives dari segala klaim, kerugian, biaya, dan tanggung jawab yang timbul akibat pelanggaran Anda terhadap syarat dan ketentuan ini atau penyalahgunaan layanan kami.</p>
            ) : (
              <p>You agree not to misuse RHP Creatives services for illegal, fraudulent, or harmful purposes. You agree to indemnify and hold RHP Creatives harmless from any claims, losses, costs, and liabilities arising from your violation of these terms and conditions or misuse of our services.</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>11.</span>{isID ? 'Penafian' : 'DISCLAIMER'}</h2>
            {isID ? (
              <>
                <p>RHP Creatives menyediakan layanan "sebagaimana adanya" dan tidak memberikan jaminan tertulis maupun tersirat tentang kelengkapan, akurasi, keandalan, kesesuaian, atau ketersediaan layanan.</p>
                <p>RHP Creatives tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami, termasuk namun tidak terbatas pada kehilangan keuntungan, data, atau peluang bisnis.</p>
              </>
            ) : (
              <>
                <p>RHP Creatives provides services "as is" and makes no written or implied warranties about the completeness, accuracy, reliability, suitability, or availability of the services.</p>
                <p>RHP Creatives is not liable for any indirect, incidental, or consequential losses arising from the use of or inability to use our services, including but not limited to loss of profits, data, or business opportunities.</p>
              </>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>12.</span>{isID ? 'Hukum yang Berlaku' : 'APPLICABLE LAWS'}</h2>
            {isID ? (
              <p>Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku di Negara Kesatuan Republik Indonesia. Setiap sengketa yang timbul dari atau berkaitan dengan syarat dan ketentuan ini akan diselesaikan secara musyawarah. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui jalur hukum yang berlaku di Indonesia.</p>
            ) : (
              <p>These terms and conditions are governed by and construed in accordance with the laws of the Republic of Indonesia. Any disputes arising from or in connection with these terms will be resolved through deliberation. If no agreement is reached, disputes will be resolved through applicable legal channels in Indonesia.</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <h2><span>13.</span>{isID ? 'PERTANYAAN & FEEDBACK' : 'QUESTIONS & FEEDBACK'}</h2>
            <div className={styles.contactBox}>
              {isID ? (
                <>
                  <p>Untuk pertanyaan terkait syarat dan ketentuan ini, jangan ragu untuk menghubungi kami:</p>
                  <p>Email: <a href="mailto:rhpcreativesid@gmail.com">rhpcreativesid@gmail.com</a></p>
                  <p>WhatsApp: <a href="https://wa.me/6285179992598" target="_blank" rel="noopener noreferrer">+62 851 7999 2598</a></p>
                </>
              ) : (
                <>
                  <p>For questions regarding these terms and conditions, don't hesitate to contact us:</p>
                  <p>Email: <a href="mailto:rhpcreativesid@gmail.com">rhpcreativesid@gmail.com</a></p>
                  <p>WhatsApp: <a href="https://wa.me/6285179992598" target="_blank" rel="noopener noreferrer">+62 851 7999 2598</a></p>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Page Footer */}
        <div className={styles.pageFooter}>
          <p className={styles.legalNotice}>RHP Creatives © 2026. All Rights Reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/privacy">{isID ? 'Kebijakan Privasi' : 'Privacy Policy'}</Link>
            <Link href="/">{isID ? 'Kembali ke Beranda' : 'Back to Home'}</Link>
          </div>
        </div>

      </div>
    </main>
  )
}
