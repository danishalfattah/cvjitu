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
import { type CVScoringData } from "@/src/utils/cvScoringService";
import { model as geminiModel } from "@/src/lib/gemini";
import pdfParse from "pdf-parse";

// Menambahkan worker-loader untuk pdf.js
if (typeof window !== "undefined") {
  (window as any).pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");
}

export default function Page() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isProcessingCV, setIsProcessingCV] = useState(false);
  const [scoringData, setScoringData] = useState<CVScoringData | null>(null);
  const [hasTriedScoring, setHasTriedScoring] = useState(false);

  // Fungsi untuk mengekstrak teks dari file PDF di browser
  const extractTextFromPdf = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        try {
          const data = await pdfParse(
            new Uint8Array(reader.result as ArrayBuffer)
          );
          resolve(data.text);
        } catch (error) {
          console.error("Gagal mem-parsing PDF:", error);
          reject("Gagal memproses file PDF. Pastikan file tidak rusak.");
        }
      };
      reader.onerror = () => {
        reject("Gagal membaca file.");
      };
    });
  };

  const handleCVUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Fitur analisis saat ini hanya mendukung file format PDF.");
      return;
    }

    setIsProcessingCV(true);
    setScoringData(null);
    try {
      // 1. Ekstrak teks dari file PDF
      const cvText = await extractTextFromPdf(file);
      if (!cvText || cvText.trim().length < 50) {
        throw new Error(
          "File PDF tidak berisi teks yang cukup untuk dianalisis."
        );
      }

      // 2. Buat Prompt untuk Gemini API
      const prompt = `
        Anda adalah sistem AI perekrutan yang sangat cerdas. Analisis teks CV berikut: "${cvText}"
        Berikan output HANYA dalam format JSON yang valid tanpa markdown, dengan struktur:
        {
          "isCV": <true atau false>,
          "overallScore": <angka 0-100>,
          "atsCompatibility": <angka 0-100>,
          "keywordMatch": <angka 0-100>,
          "readabilityScore": <angka 0-100>,
          "sections": [
            { "name": "Analisis Konten", "score": <angka>, "status": "<'excellent'|'good'|'needs_improvement'|'poor'>", "feedback": "<feedback>" },
            { "name": "Struktur & Format", "score": <angka>, "status": "<'excellent'|'good'|'needs_improvement'|'poor'>", "feedback": "<feedback>" }
          ],
          "suggestions": ["<saran 1>", "<saran 2>"]
        }
        Jika bukan CV, "isCV" harus false dan semua skor harus 0.
      `;

      // 3. Panggil Gemini API langsung dari frontend
      toast.info("AI sedang menganalisis CV Anda, mohon tunggu...");
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const analysisResult = JSON.parse(
        text.replace(/```json/g, "").replace(/```/g, "")
      );

      const finalResult: CVScoringData = {
        ...analysisResult,
        fileName: file.name,
      };

      // 4. Tampilkan hasil
      setScoringData(finalResult);
      setHasTriedScoring(true);

      if (!finalResult.isCV) {
        toast.warning("File yang diunggah terdeteksi bukan CV.", {
          description:
            "Skor diatur ke 0. Silakan coba dengan file CV yang valid.",
        });
      } else {
        toast.success("Analisis CV berhasil!");
      }
    } catch (error: any) {
      console.error("[CVJitu] Error saat analisis:", error);
      toast.error(
        error.message ||
          "Terjadi kesalahan saat menganalisis CV. Pastikan API Key Anda valid."
      );
    } finally {
      setIsProcessingCV(false);
    }
  };

  const handleResetScoring = () => setScoringData(null);
  const handleSaveToRepository = () => router.push("/dashboard");
  const handleDownloadOptimized = () => {
    console.log("Downloading optimized CV...");
  };

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
