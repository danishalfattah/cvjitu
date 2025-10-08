"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/src/context/AuthContext";
import {
  analyzeCVFile,
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
    try {
      const results = await analyzeCVFile(file);
      setScoringData(results);
      setHasTriedScoring(true);
    } catch (error) {
      console.error("[v0] Error analyzing CV:", error);
      toast.error("Terjadi kesalahan saat menganalisis CV. Silakan coba lagi.");
    } finally {
      setIsProcessingCV(false);
    }
  };

  const handleResetScoring = () => setScoringData(null);
  const handleSaveToRepository = () => router.push("/dashboard");
  const handleDownloadOptimized = () => {
    console.log("[v0] Downloading optimized CV...");
  };

  const handleTryScoring = () => {
    if (isAuthenticated) router.push("/dashboard");
    else router.push("/login");
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
      <div className="pt-20">
        <HeroSection
          onFileUpload={handleCVUpload}
          isProcessing={isProcessingCV}
          onTryScoring={handleTryScoring}
          scoringData={scoringData}
          onResetScoring={handleResetScoring}
          onSaveToRepository={handleSaveToRepository}
          onDownloadOptimized={handleDownloadOptimized}
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
