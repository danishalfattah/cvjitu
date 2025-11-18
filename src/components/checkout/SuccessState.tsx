// components/checkout/SuccessState.tsx
"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CheckCircle2, Clock, Mail, ArrowRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "../ui/alert";

interface SuccessStateProps {
  orderId: string;
  planName: string;
  total: number;
  paymentMethod: string;
  userEmail: string;
}

export function SuccessState({
  orderId,
  planName,
  total,
  paymentMethod,
  userEmail,
}: SuccessStateProps) {
  const router = useRouter();

  const paymentMethodNames: Record<string, string> = {
    "credit-card": "Credit Card",
    "bank-transfer": "Bank Transfer",
    "e-wallet": "E-Wallet",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--surface)] via-white to-[var(--red-light)] flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <Card className="p-4 md:p-6 text-center shadow-2xl">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--neutral-ink)] mb-3">
            Pembayaran Berhasil!
          </h1>

          <p className="text-gray-600 mb-6">
            Terima kasih telah berlangganan. Pesanan Anda sedang diproses.
          </p>

          {/* Order ID */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Order ID</p>
            <p className="text-2xl font-mono font-bold text-[var(--red-normal)]">
              {orderId}
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-3 mb-6 text-left bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paket</span>
              <span className="font-bold text-[var(--neutral-ink)]">
                {planName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Bayar</span>
              <span className="font-bold text-[var(--neutral-ink)]">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Metode Pembayaran</span>
              <span className="font-bold text-[var(--neutral-ink)]">
                {paymentMethodNames[paymentMethod] || paymentMethod}
              </span>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3 mb-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Clock className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Paket Anda akan aktif dalam{" "}
                <strong className="font-semibold">5 menit</strong>
              </AlertDescription>
            </Alert>

            <Alert className="bg-green-50 border-green-200">
              <Mail className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Konfirmasi pembayaran telah dikirim ke{" "}
                <strong className="font-semibold">{userEmail}</strong>
              </AlertDescription>
            </Alert>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1 bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
              size="lg"
            >
              Ke Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1 border-2 border-gray-300"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
