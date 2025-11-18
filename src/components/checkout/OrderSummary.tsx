// components/checkout/OrderSummary.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Check, Tag, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface PlanDetails {
  name: string;
  price: number;
  features: string[];
}

interface OrderSummaryProps {
  plan: PlanDetails;
  selectedPayment: string | null;
  isProcessing: boolean;
  onPayment: () => void;
}

const planDetails: Record<string, PlanDetails> = {
  basic: {
    name: "Basic",
    price: 0,
    features: [
      "Buat CV hingga 5 CV per akun",
      "Scoring CV hingga 10x / bulan",
      "Ekspor 2 CV Pertama Tanpa Watermark",
      "Saran perbaikan umum",
      "Analisis kata kunci terbatas",
    ],
  },
  freshgraduate: {
    name: "Fresh Graduate",
    price: 89400,
    features: [
      "Buat CV hingga 10 CV per akun",
      "Scoring CV hingga 30x / bulan",
      "Ekspor PDF Tanpa Watermark",
      "Saran perbaikan detail",
      "Buat CV Multi-bahasa (ID/EN)",
    ],
  },
  jobseeker: {
    name: "Job Seeker",
    price: 234000,
    features: [
      "Buat CV tanpa batas",
      "Scoring CV tanpa batas",
      "Ekspor PDF Tanpa Watermark",
      "Saran perbaikan Sangat detail",
      "Multi-bahasa (ID/EN)",
    ],
  },
};

export function OrderSummary({ plan: planProp, selectedPayment, isProcessing, onPayment }: OrderSummaryProps) {
  const plan = planProp;
  const subtotal = plan.price;
  const ppn = Math.round(subtotal * 0.11);
  const total = subtotal + ppn;

  return (
    <div className="lg:sticky lg:top-24">
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
            <p className="text-gray-600">
              {plan.name === "Basic" ? "Gratis" : "ditagih setiap 6 bulan"}
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <p className="font-semibold text-sm text-gray-700">
              Yang Anda Dapatkan:
            </p>
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">{feature}</p>
              </div>
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
              💡 <strong>Info:</strong> Paket akan otomatis diperbarui setiap 6 bulan. Anda dapat membatalkan kapan saja.
            </p>
          </div>

          {/* Payment Button */}
          <Button
            onClick={onPayment}
            disabled={!selectedPayment || isProcessing}
            className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white h-12"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Memproses Pembayaran...
              </>
            ) : (
              `Bayar Sekarang Rp ${total.toLocaleString("id-ID")}`
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export { planDetails };
