// app/checkout/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import { UserInfoCard } from "../../components/checkout/UserInfoCard";
import { PaymentSelector } from "../../components/checkout/PaymentSelector";
import { OrderSummary, planDetails } from "../../components/checkout/OrderSummary";
import { SuccessState } from "../../components/checkout/SuccessState";
import { useAuth } from "../../context/AuthContext";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  const planParam = searchParams.get("plan") || "basic";
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const plan = planDetails[planParam] || planDetails.basic;
  const total = plan.price + Math.round(plan.price * 0.11);

  const handlePayment = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate random order ID
    const newOrderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setOrderId(newOrderId);

    setIsProcessing(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <SuccessState
        orderId={orderId}
        planName={plan.name}
        total={total}
        paymentMethod={selectedPayment || ""}
        userEmail={user.email || ""}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--surface)] via-white to-[var(--red-light)]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/logo.svg"
                width={100}
                height={100}
                quality={100}
                alt="CVJitu Logo"
              />
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-[var(--red-normal)] transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--neutral-ink)] mb-2">
            Konfirmasi Pembelian
          </h1>
          <p className="text-gray-600 mb-8">
            Lengkapi pembayaran untuk mengaktifkan paket berlangganan Anda
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Info & Payment */}
          <div className="lg:col-span-2 space-y-6">
            <UserInfoCard
              userName={user.fullName || user.email || "User"}
              userEmail={user.email || ""}
            />

            <PaymentSelector
              selectedMethod={selectedPayment}
              onSelect={setSelectedPayment}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              plan={plan}
              selectedPayment={selectedPayment}
              isProcessing={isProcessing}
              onPayment={handlePayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
