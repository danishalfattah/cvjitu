// components/checkout/OrderSummary.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Check, Tag } from "lucide-react";
import { Badge } from "../ui/badge";

interface PlanDetails {
  name: string;
  price: number;
  features: string[];
}

interface OrderSummaryProps {
  plan: PlanDetails;
}

const planDetails: Record<string, PlanDetails> = {
  basic: {
    name: "Basic",
    price: 19000,
    features: [
      "5 CV Builder per bulan",
      "10 CV Scoring per bulan",
      "Template CV Standard",
      "Email Support",
    ],
  },
  freshgraduate: {
    name: "Fresh Graduate",
    price: 39000,
    features: [
      "15 CV Builder per bulan",
      "30 CV Scoring per bulan",
      "Template CV Premium",
      "AI Summary Generator",
      "Priority Email Support",
    ],
  },
  jobseeker: {
    name: "Job Seeker",
    price: 59000,
    features: [
      "Unlimited CV Builder",
      "Unlimited CV Scoring",
      "All Premium Templates",
      "AI Summary & Work Experience Generator",
      "24/7 Priority Support",
      "CV Consultation (1x/bulan)",
    ],
  },
};

export function OrderSummary({ plan: planProp }: OrderSummaryProps) {
  const plan = planProp;
  const subtotal = plan.price;
  const ppn = Math.round(subtotal * 0.11);
  const total = subtotal + ppn;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="lg:sticky lg:top-24"
    >
      <Card className="shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
            <Tag className="w-5 h-5 text-[var(--red-normal)]" />
          </div>
          <Badge className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white w-fit">
            Paket {plan.name}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price */}
          <div>
            <p className="text-3xl font-bold text-[var(--neutral-ink)]">
              Rp {subtotal.toLocaleString("id-ID")}
            </p>
            <p className="text-gray-600">/bulan</p>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <p className="font-semibold text-sm text-gray-700">
              Yang Anda Dapatkan:
            </p>
            {plan.features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">{feature}</p>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">PPN (11%)</span>
              <span className="font-medium">
                Rp {ppn.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-[var(--neutral-ink)]">
                  Total
                </span>
                <span className="text-xl font-bold text-[var(--red-normal)]">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>Info:</strong> Paket akan otomatis diperbarui setiap
              bulan. Anda dapat membatalkan kapan saja.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { planDetails };
