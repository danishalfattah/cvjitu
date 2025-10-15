"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NavBar, type User as NavBarUser } from "@/src/components/NavBar";
import { HeroSection } from "@/src/components/landing-page/HeroSection";
import { FeaturesSection } from "@/src/components/landing-page/FeaturesSection";
import { HowItWorksSection } from "@/src/components/landing-page/HowItWorksSection";
import { WhyUsSection } from "@/src/components/landing-page/WhyUsSection";
import { PricingSection } from "@/src/components/landing-page/PricingSection";
import { FAQSection } from "@/src/components/landing-page/FAQSection";
import { Footer } from "@/src/components/Footer";
import { useAuth } from "@/src/context/AuthContext";

// Definisikan tipe data untuk hasil scoring di sini
export interface CVScoringData {
  fileName: string;
  isCv: boolean;
  overallScore: number;
  atsCompatibility: number;
  keywordMatch: number;
  readabilityScore: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
    status: "excellent" | "good" | "average" | "needs_improvement";
  }[];
  suggestions: string[];
}

export default function Page() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isProcessingCV, setIsProcessingCV] = useState(false);
  const [scoringData, setScoringData] = useState<CVScoringData | null>(null);

  const handleCVUpload = async (file: File) => {
    setIsProcessingCV(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/score-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Gagal mendapatkan analisis dari server."
        );
      }

      const results = await response.json();
      setScoringData({
        fileName: file.name,
        ...results,
      });
    } catch (error: any) {
      console.error("[v0] Error analyzing CV:", error);
      toast.error(
        error.message ||
          "Terjadi kesalahan saat menganalisis CV. Silakan coba lagi."
      );
    } finally {
      setIsProcessingCV(false);
    }
  };

  const handleResetScoring = () => setScoringData(null);
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
    toast.success("Berhasil keluar.");
    router.push("/");
  };

  const navBarUser: NavBarUser | null = user
    ? {
        id: user.id, // -> Mengubah 'uid' menjadi 'id'
        fullName: user.fullName, // -> Mengubah 'displayName' menjadi 'fullName'
        email: user.email,
        avatar: user.avatar, // -> Mengubah 'photoURL' menjadi 'avatar'
      }
    : null;

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <NavBar
        user={navBarUser}
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
          simplifiedView={true}
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
