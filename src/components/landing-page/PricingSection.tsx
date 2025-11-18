"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check } from "lucide-react";
import { SubscriptionModal } from "../modals/SubscriptionModal";
import { useAuth } from "../../context/AuthContext";

const pricingPlans = [
  {
    name: "Basic",
    price: "Rp 0",
    billing: "Rp 0",
    period: "bulan",
    popular: false,
    features: [
      "Buat CV hingga 5 CV per akun",
      "Scoring CV hingga 10x / bulan",
      "Ekspor 2 CV Pertama Tanpa Watermark",
      "Saran perbaikan umum",
      "Analisis kata kunci terbatas",
    ],
    cta: "Buat Akun Gratis",
    ctaVariant: "outline" as const,
  },
  {
    name: "Fresh Graduate",
    price: "Rp 14.900",
    billing: "≈ Rp 89.400",
    period: "bulan",
    popular: true,
    badge: "TERBAIK UNTUK LULUSAN BARU",
    features: [
      "Buat CV hingga 10 CV per akun",
      "Scoring CV hingga 30x / bulan",
      "Ekspor PDF Tanpa Watermark",
      "Saran perbaikan detail",
      "Buat CV Multi-bahasa (ID/EN)",
    ],
    cta: "Pilih Penawaran Terbaik",
    ctaVariant: "default" as const,
  },
  {
    name: "Job Seeker",
    price: "Rp 39.000",
    billing: "≈ Rp 234.000",
    period: "bulan",
    popular: false,
    features: [
      "Buat CV tanpa batas",
      "Scoring CV tanpa batas",
      "Ekspor PDF Tanpa Watermark",
      "Saran perbaikan Sangat detail",
      "Multi-bahasa (ID/EN)",
    ],
    cta: "Pilih Paket Ini",
    ctaVariant: "default" as const,
  },
];

export function PricingSection() {
  const router = useRouter();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleSelectPlan = (planName: string) => {
    // Jika Basic (gratis), langsung redirect ke register
    if (planName === "Basic") {
      router.push("/register");
      return;
    }

    // Jika user belum login, tampilkan modal
    if (!user) {
      setSelectedPlan(planName);
      setIsModalOpen(true);
      return;
    }

    // Jika sudah login, redirect ke checkout
    const planSlug = planName.toLowerCase().replace(/\s/g, "");
    router.push(`/checkout?plan=${planSlug}`);
  };

  return (
    <>
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
      />

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-white border-2 transition-smooth hover:shadow-lg hover:-translate-y-1 ${
                plan.popular
                  ? "border-[var(--red-normal)] shadow-lg scale-105"
                  : "border-[var(--border-color)] hover:border-[var(--red-light)]"
              }`}
            >
              {plan.popular && plan.badge && (
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
                  {plan.name === "Basic" ? (
                    <p className="text-sm text-gray-500">Gratis</p>
                  ) : (
                    plan.billing && (
                      <p className="text-sm text-gray-500">
                        ditagih setiap 6 bulan: {plan.billing}
                      </p>
                    )
                  )}
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
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-3 ${
                    plan.ctaVariant === "default"
                      ? "bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                      : "border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
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
    </>
  );
}
