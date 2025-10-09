const steps = [
  {
    number: 1,
    title: "Buat CV Anda dengan bantuan AI",
    description: "AI kami membantu Anda menulis CV yang menarik dan profesional"
  },
  {
    number: 2,
    title: "Scoring CV dengan bantuan AI",
    description: "Sistem AI menganalisis dan memberi skor 1-100 pada CV Anda"
  },
  {
    number: 3,
    title: "Revisi CV berdasarkan saran AI",
    description: "Implementasikan saran perbaikan untuk meningkatkan skor CV"
  },
  {
    number: 4,
    title: "Optimalkan hasil & raih skor terbaik",
    description: "Dapatkan CV sempurna dan siap kirim ke recruiter"
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-[var(--neutral-ink)] mb-4">
            Cara Kerja CVJitu
          </h2>
          <p className="text-lg text-gray-400">
            4 langkah sederhana untuk CV sempurna
          </p>
        </div>
        
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex items-center">
                {/* Step number circle */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-[var(--red-normal)] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                
                {/* Step content card */}
                <div className="ml-8 flex-1 bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-poppins font-semibold text-xl text-[var(--neutral-ink)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
