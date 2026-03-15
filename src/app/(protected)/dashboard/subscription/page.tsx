"use client";

import { useAuth } from "@/context/AuthContext";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const getExpirationDate = (premiumSince?: string) => {
    if (!premiumSince) return null;
    const date = new Date(premiumSince);
    date.setMonth(date.getMonth() + 6);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStartDate = (premiumSince?: string) => {
    if (!premiumSince) return null;
    return new Date(premiumSince).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const planInfo = {
    Basic: {
      color: "gray",
      features: [
        "Sisa 2x Export PDF tanpa watermark",
        "Kredit Scoring AI terbatas",
        "Template standar",
      ],
      icon: Zap,
    },
    "Fresh Graduate": {
      color: "red",
      features: [
        "10 Kredit Buat CV",
        "30 Kredit Scoring AI",
        "Export PDF tanpa watermark (Unlimited)",
        "Akses semua template Premium",
      ],
      icon: CrownIcon,
    },
    "Job Seeker": {
      color: "red",
      features: [
        "Kredit Buat CV Tak Terbatas",
        "Kredit Scoring AI Tak Terbatas",
        "Export PDF tanpa watermark (Unlimited)",
        "Prioritas dukungan AI",
      ],
      icon: CrownIcon,
    },
  };

  const isPremium = user.plan !== "Basic";

  return (
    <div className="p-4 sm:p-6  mx-auto min-h-screen">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>Pages</span>
          <span>/</span>
          <span className="text-[var(--neutral-ink)]">
            Subscription Management
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
          Manajemen Langganan
        </h1>
        <p className="text-gray-600 mt-1">
          Kelola paket dan pantau masa aktif langganan Anda
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <Card className="md:col-span-2 border-[var(--border-color)] overflow-hidden shadow-sm">
          <div className="bg-gray-50/50 p-6 border-b border-[var(--border-color)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-xl ${isPremium ? "bg-[var(--red-light)] text-[var(--red-normal)]" : "bg-gray-100 text-gray-500"}`}
                >
                  {isPremium ? (
                    <ShieldCheck className="w-8 h-8" />
                  ) : (
                    <Zap className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--neutral-ink)]">
                    Paket {user.plan}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isPremium ? "Pelanggan Premium CVJitu" : "Pengguna Gratis"}
                  </p>
                </div>
              </div>
              <Badge
                className={
                  isPremium
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-600"
                }
              >
                {isPremium ? "Aktif" : "Free Tier"}
              </Badge>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-[var(--neutral-ink)] mb-4">
              Fitur yang Anda miliki:
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {(
                planInfo[user.plan as keyof typeof planInfo]?.features || []
              ).map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {isPremium && user.premiumSince ? (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-600 font-medium">
                      Masa Berlaku Paket
                    </p>
                    <p className="text-sm font-semibold text-blue-900">
                      {getStartDate(user.premiumSince)} —{" "}
                      {getExpirationDate(user.premiumSince)}
                    </p>
                  </div>
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-blue-700 border border-blue-100 shadow-sm uppercase tracking-wider">
                  Perpanjangan Otomatis
                </div>
              </div>
            ) : (
              <div className="bg-[var(--red-light)]/30 border border-[var(--red-light)]/50 rounded-xl p-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--neutral-ink)]">
                  Upgrade ke Premium untuk fitur lebih lengkap!
                </p>
                <Button
                  size="sm"
                  onClick={() => router.push("/dashboard/subscription/payment")}
                  className="bg-[var(--red-normal)] hover:bg-[var(--red-hover)]"
                >
                  Lihat Paket
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 border-[var(--border-color)]">
            <h3 className="font-bold text-[var(--neutral-ink)] mb-4">
              Aksi Langganan
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-gray-700"
                onClick={() => router.push("/dashboard/subscription/payment")}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isPremium ? "Ubah/Perpanjang Paket" : "Berlangganan Sekarang"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-gray-700"
                onClick={() => router.push("/dashboard/subscription/history")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Riwayat Pembayaran
              </Button>

              {isPremium && (
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                    Batalkan perpanjangan otomatis
                  </button>
                </div>
              )}
            </div>
          </Card>

          <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Langganan Anda akan diperbarui secara otomatis setiap 6 bulan
                jika menggunakan metode pembayaran yang mendukung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CrownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
