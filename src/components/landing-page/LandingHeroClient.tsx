"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NavBar, type User as NavBarUser } from "@/components/NavBar";
import { HeroSection } from "@/components/landing-page/HeroSection";

import { type CVScoringData } from "@/lib/types";

interface LandingHeroClientProps {
  initialUser: NavBarUser | null;
  isAuthenticated: boolean;
}

export function LandingHeroClient({
  initialUser,
  isAuthenticated,
}: LandingHeroClientProps) {
  const router = useRouter();
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
          errorData.error || "Gagal mendapatkan analisis dari server.",
        );
      }

      const results = await response.json();
      setScoringData({
        fileName: file.name,
        ...results,
      });
    } catch (error: any) {
      console.error("Error analyzing CV:", error);
      toast.error(
        error.message ||
          "Terjadi kesalahan saat menganalisis CV. Silakan coba lagi.",
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

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    setScoringData(null);
    toast.success("Berhasil keluar.");
    router.refresh();
  };

  return (
    <>
      <NavBar
        user={initialUser}
        onLogin={() => router.push("/login")}
        onRegister={() => router.push("/register")}
        onLogout={handleLogout}
        onDashboard={handleGoToDashboard}
      />
      <div className="pt-20">
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
      </div>
    </>
  );
}
