import { Button } from "./ui/button";
import { ArrowLeft, Shield } from "lucide-react";

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  return (
    <div className="min-h-screen bg-[var(--surface)] py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-gray-500 hover:text-[var(--red-normal)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[var(--red-normal)] rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">CV</span>
            </div>
            <span className="font-poppins font-semibold text-xl text-[var(--neutral-ink)]">CVJitu</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-[var(--border-color)] shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-[var(--red-normal)]" />
            <h1 className="text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
              Kebijakan Privasi
            </h1>
          </div>
          
          <div className="prose max-w-none space-y-6">
            <div className="text-sm text-gray-500 mb-6">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                1. Pengantar
              </h2>
              <p className="text-gray-600 leading-relaxed">
                CVJitu berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda. 
                Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, 
                menyimpan, dan melindungi informasi Anda saat menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                2. Informasi yang Kami Kumpulkan
              </h2>
              
              <h3 className="text-lg font-medium text-[var(--neutral-ink)] mb-2 mt-4">
                Informasi Pribadi
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Nama lengkap dan alamat email saat registrasi</li>
                <li>Informasi profil yang Anda berikan secara sukarela</li>
                <li>Data CV yang Anda unggah untuk analisis</li>
                <li>Riwayat penggunaan layanan dan preferensi</li>
              </ul>

              <h3 className="text-lg font-medium text-[var(--neutral-ink)] mb-2 mt-4">
                Informasi Teknis
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Alamat IP dan informasi perangkat</li>
                <li>Data log aktivitas dan waktu akses</li>
                <li>Cookies dan teknologi pelacakan serupa</li>
                <li>Informasi browser dan sistem operasi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                3. Bagaimana Kami Menggunakan Informasi
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Kami menggunakan informasi Anda untuk:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Menyediakan dan meningkatkan layanan CVJitu</li>
                <li>Melakukan analisis CV dan memberikan rekomendasi</li>
                <li>Mengelola akun dan memberikan dukungan pelanggan</li>
                <li>Mengirim pemberitahuan penting tentang layanan</li>
                <li>Menganalisis penggunaan untuk pengembangan produk</li>
                <li>Mematuhi kewajiban hukum dan regulasi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                4. Penyimpanan dan Keamanan Data
              </h2>
              
              <h3 className="text-lg font-medium text-[var(--neutral-ink)] mb-2 mt-4">
                Keamanan Data
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                Kami menerapkan langkah-langkah keamanan yang kuat untuk melindungi data Anda:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Enkripsi data end-to-end untuk semua transmisi</li>
                <li>Penyimpanan data di server yang aman dan terpantau</li>
                <li>Kontrol akses yang ketat dan autentikasi multi-faktor</li>
                <li>Audit keamanan dan pemantauan berkelanjutan</li>
              </ul>

              <h3 className="text-lg font-medium text-[var(--neutral-ink)] mb-2 mt-4">
                Retensi Data
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Kami menyimpan data pribadi Anda selama akun aktif atau seperlunya untuk 
                menyediakan layanan. Data akan dihapus sesuai permintaan atau setelah 
                periode retensi yang ditentukan oleh hukum yang berlaku.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                5. Berbagi Informasi
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. 
                Kami hanya membagikan informasi dalam situasi terbatas:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Dengan persetujuan eksplisit dari Anda</li>
                <li>Kepada penyedia layanan terpercaya yang membantu operasional kami</li>
                <li>Untuk mematuhi kewajiban hukum atau perintah pengadilan</li>
                <li>Dalam kasus merger, akuisisi, atau penjualan aset perusahaan</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                6. Hak Anda atas Data
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Anda memiliki hak untuk:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Mengakses dan meninjau data pribadi yang kami miliki</li>
                <li>Memperbarui atau mengoreksi informasi yang tidak akurat</li>
                <li>Menghapus akun dan data pribadi Anda</li>
                <li>Membatasi atau menolak pemrosesan data tertentu</li>
                <li>Memindahkan data Anda ke layanan lain (portabilitas data)</li>
                <li>Mengajukan keluhan kepada otoritas perlindungan data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                7. Cookies dan Teknologi Pelacakan
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Kami menggunakan cookies dan teknologi serupa untuk:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Menjaga sesi login dan preferensi pengguna</li>
                <li>Menganalisis penggunaan situs web untuk perbaikan</li>
                <li>Menyediakan konten yang dipersonalisasi</li>
                <li>Memastikan keamanan dan mencegah penipuan</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                Anda dapat mengatur preferensi cookies melalui pengaturan browser Anda.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                8. Transfer Data Internasional
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Data Anda mungkin diproses dan disimpan di server yang berlokasi di negara lain. 
                Kami memastikan bahwa transfer data internasional dilakukan dengan perlindungan 
                yang memadai sesuai dengan standar privasi internasional.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                9. Perubahan Kebijakan
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan 
                material akan diberitahukan melalui email atau pemberitahuan di platform. 
                Tanggal "Terakhir diperbarui" di bagian atas menunjukkan revisi terbaru.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                10. Hubungi Kami
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin 
                menggunakan hak-hak data Anda, silakan hubungi kami:
              </p>
              <div className="p-4 bg-[var(--surface)] rounded-lg">
                <p className="text-gray-600">
                  <strong>Data Protection Officer</strong><br />
                  <strong>Email:</strong> privacy@cvjitu.com<br />
                  <strong>Alamat:</strong> Jakarta, Indonesia<br />
                  <strong>Website:</strong> www.cvjitu.com
                </p>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6 mt-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Komitmen Kami untuk Privasi Anda
                </h3>
                <p className="text-blue-800 text-sm">
                  CVJitu berkomitmen penuh untuk melindungi privasi dan keamanan data Anda. 
                  Kami mengikuti praktik terbaik industri dan mematuhi regulasi perlindungan 
                  data yang berlaku untuk memastikan informasi Anda tetap aman dan terlindungi.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
