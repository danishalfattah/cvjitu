import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bot, BarChart3, Database, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Pembuat CV AI",
    description:
      "Bantuan AI untuk membuat CV profesional dengan template yang dioptimalkan untuk ATS",
  },
  {
    icon: BarChart3,
    title: "Skor Otomatis 1–100",
    description:
      "Penilaian otomatis dengan rincian detail untuk meningkatkan kualitas CV Anda",
  },
  {
    icon: Database,
    title: "Repositori CV",
    description:
      "Simpan dan kelola semua versi CV Anda dalam satu tempat yang terorganisir",
  },
  {
    icon: CheckCircle,
    title: "Template ATS",
    description:
      "Template yang telah terbukti lolos sistem ATS dari berbagai perusahaan",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-[var(--neutral-ink)] mb-4">
            Fitur Unggulan CVJitu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Platform lengkap untuk membuat, mengevaluasi, dan mengoptimalkan CV
            Anda dengan teknologi AI terdepan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-[var(--border-color)] hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-[var(--red-light)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-[var(--red-normal)]" />
                </div>
                <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
