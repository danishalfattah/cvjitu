// components/checkout/SuccessState.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CheckCircle2, Clock, Mail, ArrowRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "../ui/alert";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

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
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const paymentMethodNames: Record<string, string> = {
    "credit-card": "Credit Card",
    "bank-transfer": "Bank Transfer",
    "e-wallet": "E-Wallet",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--surface)] via-white to-[var(--red-light)] flex items-center justify-center p-4">
      {/* Confetti */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={400}
        gravity={0.3}
      />

      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="p-8 md:p-12 text-center shadow-2xl">
          {/* Success Icon */}
          <motion.div
            className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-[var(--neutral-ink)] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Pembayaran Berhasil!
          </motion.h1>

          <motion.p
            className="text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Terima kasih telah berlangganan. Pesanan Anda sedang diproses.
          </motion.p>

          {/* Order ID */}
          <motion.div
            className="bg-gray-50 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-600 mb-2">Order ID</p>
            <p className="text-2xl font-mono font-bold text-[var(--red-normal)]">
              {orderId}
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            className="space-y-3 mb-8 text-left bg-white border border-gray-200 rounded-lg p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
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
          </motion.div>

          {/* Alerts */}
          <motion.div
            className="space-y-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
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
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
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
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
