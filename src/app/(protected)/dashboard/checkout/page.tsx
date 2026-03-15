"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserInfoCard } from "@/components/checkout/UserInfoCard";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { OrderSummary, planDetails } from "@/components/checkout/OrderSummary";
import { SuccessState } from "@/components/checkout/SuccessState";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function DashboardCheckoutContent() {
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
      router.push(`/login?redirect=dashboard/checkout&plan=${planParam}`);
    }
  }, [user, authLoading, router, planParam]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
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

    try {
      const response = await fetch("/api/payment/mayar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planParam }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menginisiasi pembayaran");
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Link pembayaran tidak ditemukan dari server");
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan sistem.");
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="p-4 sm:p-6 min-h-screen">
         <SuccessState
          orderId={orderId}
          planName={plan.name}
          total={total}
          paymentMethod={selectedPayment || ""}
          userEmail={user.email || ""}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>Pages</span>
          <span>/</span>
          <span className="text-[var(--neutral-ink)]">Checkout</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
            Konfirmasi Pembelian
        </h1>
        <p className="text-gray-600 mt-1">
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
  );
}

export default function DashboardCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
        </div>
      }
    >
      <DashboardCheckoutContent />
    </Suspense>
  );
}
