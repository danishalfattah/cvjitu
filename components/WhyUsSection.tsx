import { Check, X } from "lucide-react";

const comparisons = [
  { criteria: "Ramah ATS", cvjitu: true, others: false },
  { criteria: "Saran otomatis", cvjitu: true, others: false },
  { criteria: "Skor 1–100", cvjitu: true, others: false },
  { criteria: "Template modern", cvjitu: true, others: true },
  { criteria: "Pencocokan kata kunci", cvjitu: true, others: false },
  { criteria: "Repositori & versi", cvjitu: true, others: false },
  { criteria: "Ekspor PDF/DOCX", cvjitu: true, others: true },
  { criteria: "Multi-bahasa", cvjitu: true, others: false },
  { criteria: "Privasi & enkripsi", cvjitu: true, others: false },
  { criteria: "Link berbagi recruiter", cvjitu: true, others: false }
];

export function WhyUsSection() {
  return (
    <section id="why-us" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-[var(--neutral-ink)] mb-4">
            Mengapa Memilih CVJitu?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bandingkan fitur lengkap CVJitu dengan platform CV builder lainnya
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--border-color)] overflow-hidden">
          <div className="grid grid-cols-3 bg-[var(--surface)] border-b border-[var(--border-color)]">
            <div className="p-6">
              <h3 className="font-poppins font-semibold text-lg text-[var(--neutral-ink)]">Kriteria</h3>
            </div>
            <div className="p-6 bg-[var(--red-light)] border-x border-[var(--border-color)]">
              <h3 className="font-poppins font-semibold text-lg text-[var(--red-normal)] text-center">CVJitu</h3>
            </div>
            <div className="p-6">
              <h3 className="font-poppins font-semibold text-lg text-gray-600 text-center">Pembuat CV Lainnya</h3>
            </div>
          </div>
          
          {comparisons.map((item, index) => (
            <div key={index} className={`grid grid-cols-3 border-b border-[var(--border-color)] ${index % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-white'}`}>
              <div className="p-4">
                <span className="text-[var(--neutral-ink)] font-medium">{item.criteria}</span>
              </div>
              <div className="p-4 flex justify-center border-x border-[var(--border-color)]">
                {item.cvjitu ? (
                  <Check className="w-6 h-6 text-[var(--success)]" />
                ) : (
                  <X className="w-6 h-6 text-[var(--error)]" />
                )}
              </div>
              <div className="p-4 flex justify-center">
                {item.others ? (
                  <Check className="w-6 h-6 text-[var(--success)]" />
                ) : (
                  <X className="w-6 h-6 text-[var(--error)]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
