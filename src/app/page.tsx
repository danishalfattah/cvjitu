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
  analyzeCVFile,
  type CVScoringData,
} from "@/src/utils/cvScoringService";

export default function Page() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isProcessingCV, setIsProcessingCV] = useState(false);
  const [scoringData, setScoringData] = useState<CVScoringData | null>(null);
  const [hasTriedScoring, setHasTriedScoring] = useState(false);

  const handleCVUpload = async (fileIdentifier: {
    name: string;
    url: string;
  }) => {
    setIsProcessingCV(true);
    try {
      // Fetch the file from the provided URL
      const response = await fetch(fileIdentifier.url);
      const blob = await response.blob();
      const file = new File([blob], fileIdentifier.name, { type: blob.type });
      const results = await analyzeCVFile(file);
      setScoringData(results);
      setHasTriedScoring(true);
    } catch (error) {
      console.error("Error analyzing CV:", error);
      toast.error("Terjadi kesalahan saat menganalisis CV. Silakan coba lagi.");
    } finally {
      setIsProcessingCV(false);
    }
  };

  const handleResetScoring = () => setScoringData(null);

  // Arahkan ke dashboard baik untuk menyimpan atau melihat detail
  const handleGoToDashboard = () => router.push("/dashboard");

  const handleAuthAction = () => {
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
        onDashboard={handleGoToDashboard}
      />
      <div className="pt-17 ">
        <HeroSection
          onFileUpload={handleCVUpload}
          isProcessing={isProcessingCV}
          onStartNow={handleAuthAction}
          scoringData={scoringData}
          onResetScoring={handleResetScoring}
          onSaveToRepository={handleGoToDashboard}
          isAuthenticated={isAuthenticated}
          onAuthAction={handleAuthAction}
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
