// components/landing-page/FAQSection.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqs = [
  {
    question: "Bagaimana cara kerja AI scoring di CVJitu?",
    answer:
      "CVJitu memanfaatkan kecerdasan buatan yaitu Gemini, untuk melakukan analisis CV yang komprehensif. Gemini akan mengevaluasi berbagai aspek penting seperti kesesuaian dengan ATS, penggunaan kata kunci yang relevan, struktur konten, kejelasan dalam penulisan pencapaian, dan memberikan skor objektif dari 1-100 beserta rekomendasi yang bisa langsung Anda terapkan.",
  },
  {
    question:
      "Bisakah saya menggunakan CVJitu untuk berbagai posisi pekerjaan?",
    answer:
      "Tentu! CVJitu mendukung pembuatan multiple CV dengan kategori berbeda. Anda bisa menyesuaikan setiap CV untuk posisi spesifik dengan keyword matching yang optimal.",
  },
  {
    question: "Bagaimana Kebijakan privasi dan keamanan data di CVJiitu?",
    answer:
      "Data Anda diamankan dengan enkripsi end-to-end. Kami tidak membagikan informasi pribadi kepada pihak ketiga dan mematuhi standar GDPR. Anda memiliki kontrol penuh atas data CV Anda.",
  },
  {
    question: "Apakah ada garansi uang kembali jika tidak puas?",
    answer:
      "Ya, kami menyediakan garansi 30 hari uang kembali untuk semua paket berbayar. Jika Anda tidak puas dengan layanan kami, silakan hubungi tim support untuk refund penuh.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-[var(--neutral-ink)] mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-gray-600">
            Pertanyaan yang sering diajukan tentang CVJitu
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-[var(--border-color)] rounded-lg px-6 data-[state=open]:bg-[var(--surface)] !border-b "
            >
              <AccordionTrigger className="text-left hover:no-underline py-6 text-[var(--neutral-ink)] font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
