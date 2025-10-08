import { Button } from "./ui/button";
import { ArrowLeft, FileText } from "lucide-react";

interface TermsOfServicePageProps {
  onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
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
            <FileText className="w-6 h-6 text-[var(--red-normal)]" />
            <h1 className="text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
              Syarat & Ketentuan
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
                1. Penerimaan Syarat
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Dengan mengakses dan menggunakan layanan CVJitu, Anda menyatakan bahwa Anda telah membaca, 
                memahami, dan menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak 
                menyetujui syarat ini, harap tidak menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                2. Layanan yang Disediakan
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                CVJitu menyediakan platform berbasis AI untuk:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Pembuatan CV profesional dengan template yang telah dioptimalkan</li>
                <li>Analisis dan scoring CV otomatis dengan skala 1-100</li>
                <li>Saran perbaikan berbasis AI untuk meningkatkan kualitas CV</li>
                <li>Penyimpanan dan manajemen versi CV dalam repositori pribadi</li>
                <li>Template yang kompatibel dengan sistem ATS (Applicant Tracking System)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                3. Akun dan Registrasi
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Untuk menggunakan fitur lengkap CVJitu, Anda perlu membuat akun dengan informasi yang akurat dan terkini. Anda bertanggung jawab untuk:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Menjaga kerahasiaan informasi login Anda</li>
                <li>Memberikan informasi yang akurat saat registrasi</li>
                <li>Memberitahu kami jika terjadi penggunaan akun yang tidak sah</li>
                <li>Memperbarui informasi akun secara berkala</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                4. Penggunaan yang Dilarang
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Anda dilarang untuk:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Menggunakan layanan untuk tujuan ilegal atau tidak etis</li>
                <li>Mengunggah konten yang mengandung virus atau malware</li>
                <li>Mencoba mengakses sistem atau data yang tidak berwenang</li>
                <li>Menggunakan layanan untuk spam atau aktivitas yang merugikan</li>
                <li>Melanggar hak kekayaan intelektual pihak lain</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                5. Privasi dan Data
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Kami berkomitmen untuk melindungi privasi Anda. Informasi mengenai pengumpulan, 
                penggunaan, dan perlindungan data pribadi Anda dijelaskan secara detail dalam 
                Kebijakan Privasi kami. Dengan menggunakan layanan ini, Anda menyetujui praktik 
                yang dijelaskan dalam kebijakan tersebut.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                6. Kekayaan Intelektual
              </h2>
              <p className="text-gray-600 leading-relaxed">
                CVJitu dan semua kontennya, termasuk namun tidak terbatas pada teks, grafik, logo, 
                ikon, gambar, dan perangkat lunak, adalah milik CVJitu atau pemberi lisensinya dan 
                dilindungi oleh hukum kekayaan intelektual. CV yang Anda buat menggunakan platform 
                kami tetap menjadi milik Anda.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                7. Pembatasan Tanggung Jawab
              </h2>
              <p className="text-gray-600 leading-relaxed">
                CVJitu menyediakan layanan "sebagaimana adanya" tanpa jaminan eksplisit atau implisit. 
                Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, 
                atau konsekuensial yang timbul dari penggunaan layanan kami. Hasil analisis AI 
                adalah rekomendasi dan tidak menjamin kesuksesan dalam aplikasi pekerjaan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                8. Perubahan Syarat
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan 
                diberitahukan melalui platform atau email. Penggunaan layanan setelah perubahan 
                berarti Anda menyetujui syarat yang telah diperbarui.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                9. Penghentian Layanan
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Kami berhak untuk menghentikan atau menangguhkan akses Anda ke layanan kapan saja 
                jika Anda melanggar syarat dan ketentuan ini atau melakukan aktivitas yang merugikan 
                platform atau pengguna lain.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-3">
                10. Kontak
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami di:
              </p>
              <div className="mt-3 p-4 bg-[var(--surface)] rounded-lg">
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@cvjitu.com<br />
                  <strong>Website:</strong> www.cvjitu.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
