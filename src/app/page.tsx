// src/app/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NavBar } from "@/src/components/NavBar";
import { HeroSection } from "@/src/components/landing-page/HeroSection";
import { FeaturesSection } from "@/src/components/landing-page/FeaturesSection";
import { HowItWorksSection } from "@/src/components/landing-page/HowItWorksSection";
import { WhyUsSection } from "@/src/components/landing-page/WhyUsSection";
import { PricingSection } from "@/src/components/landing-page/PricingSection";
import { FAQSection } from "@/src/components/landing-page/FAQSection";
import { Footer } from "@/src/components/Footer";
import { useAuth } from "@/src/context/AuthContext";
import {
  analyzeCVFile, // Kita akan ganti ini dengan fetch
  type CVScoringData,
} from "@/src/utils/cvScoringService";

export default function Page() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isProcessingCV, setIsProcessingCV] = useState(false);
  const [scoringData, setScoringData] = useState<CVScoringData | null>(null);
  const [hasTriedScoring, setHasTriedScoring] = useState(false);

  const handleCVUpload = async (file: File) => {
    if (hasTriedScoring && !isAuthenticated) {
      toast.error(
        "Silakan login terlebih dahulu untuk melakukan analisis CV lagi"
      );
      return;
    }
    setIsProcessingCV(true);
    setScoringData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/cv/analyze", {
        method: "POST",
        body: formData,
      });

      const results = await response.json();

      if (!response.ok) {
        throw new Error(results.message || "Gagal menganalisis CV");
      }

      if (results.isCv === false) {
        toast.error(results.message || "File ini bukan CV yang valid.");
        setHasTriedScoring(true);
      } else {
        setScoringData(results);
        setHasTriedScoring(true);
      }
    } catch (error) {
      console.error("[v0] Error analyzing CV:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menganalisis CV. Silakan coba lagi."
      );
    } finally {
      setIsProcessingCV(false);
    }
  };

  const handleResetScoring = () => setScoringData(null);

  // Fungsi ini menangani semua aksi navigasi (login/dashboard)
  const handleStartNow = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = () => {
    logout();
    setScoringData(null);
    setHasTriedScoring(false);
    toast.success("Berhasil keluar.");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <NavBar
        user={user}
        onLogin={() => router.push("/login")}
        onRegister={() => router.push("/register")}
        onLogout={handleLogout}
        onDashboard={() => router.push("/dashboard")}
      />
      <div className="pt-17 ">
        <HeroSection
          onFileUpload={handleCVUpload}
          isProcessing={isProcessingCV}
          onStartNow={handleStartNow}
          scoringData={scoringData}
          onResetScoring={handleResetScoring}
          hasTriedScoring={hasTriedScoring}
          isAuthenticated={isAuthenticated}
        />
        <FeaturesSection />
        <HowItWorksSection />
        <WhyUsSection />
        <PricingSection />
        <FAQSection />
        <Footer />
      </div>
    </div>
  );
}
