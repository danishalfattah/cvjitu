import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Basic",
    price: "IDR 0",
    billing: "IDR 0",
    period: "month",
    popular: false,
    features: [
      "5 CV total per akun",
      "10 AI review credits / bulan",
      "3 Basic templates (ATS-friendly)",
      "Export PDF",
      "Keyword Match (maks 3 keyword)",
      "Version history (maks 3 revisi)",
      "Support: Community",
    ],
    cta: "Buat Akun Gratis",
    ctaVariant: "outline" as const,
  },
  {
    name: "Fresh Graduate",
    price: "IDR 14.900",
    billing: "≈ IDR 89.400",
    period: "month",
    popular: true,
    badge: "BEST FOR STUDENTS",
    features: [
      "50 CV / bulan (reset bulanan)",
      "200 AI review credits / bulan",
      "10 Templates + tema kampus/entry-level",
      "Export PDF & DOCX",
      "Keyword Match (maks 10 lowongan tersimpan)",
      "Version history (20 revisi)",
      "Multi-bahasa (ID/EN)",
      "Support: Standard",
    ],
    cta: "Pilih Penawaran Terbaik",
    ctaVariant: "default" as const,
  },
  {
    name: "Job Seeker",
    price: "IDR 39.000",
    billing: "≈ IDR 234.000",
    period: "month",
    popular: false,
    features: [
      "Unlimited CV",
      "AI review credits Unlimited + Smart Fix 1-klik",
      "Semua Premium templates + custom cover letter",
      "Export PDF & DOCX, custom watermark off",
      "Advanced Keyword Match + rekomendasi optimasi",
      "Version history Unlimited + analytics skor",
      "Recruiter Share Link & view analytics",
      "Support: Priority",
    ],
    cta: "Pilih Paket Ini",
    ctaVariant: "default" as const,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-6 bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-[var(--neutral-ink)] mb-4">
            Pilih Paket yang Tepat
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mulai gratis atau pilih paket yang sesuai dengan kebutuhan karir
            Anda
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-[var(--card-background)] border-2 transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? "border-[var(--red-normal)] shadow-lg scale-105"
                  : "border-[var(--border-color)] hover:border-[var(--red-light)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[var(--red-normal)] text-white px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-poppins text-[var(--neutral-ink)]">
                  {plan.name}
                </CardTitle>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[var(--red-normal)]">
                    {plan.price}
                    <span className="text-base font-normal text-gray-600">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    billed every 6 months: {plan.billing}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <Check className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 ${
                    plan.ctaVariant === "default"
                      ? "bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                      : "border-[var(--red-normal)]  text-[var(--red-normal)] hover:bg-[var(--red-light)]"
                  }`}
                  variant={plan.ctaVariant}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Semua harga sudah termasuk pajak. Dapat dibatalkan kapan saja.
          </p>
        </div>
      </div>
    </section>
  );
}
