import { useState } from "react";
import { FileUploadZone } from "./FileUploadZone";
import { CVScoringResult } from "./CVScoringResult";
import { analyzeCVFile, CVScoringData } from "../src/utils/cvScoringService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart3, Bot, FileText, TrendingUp } from "lucide-react";

export function CVScoringPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [scoringData, setScoringData] = useState<CVScoringData | null>(null);

  const handleCVUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const results = await analyzeCVFile(file);
      setScoringData(results);
    } catch (error) {
      console.error("Error analyzing CV:", error);
      // Handle error - could show a toast notification
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToUpload = () => {
    setScoringData(null);
  };

  const handleSaveToRepository = () => {
    // TODO: Add CV to dashboard repository
    console.log("Saving CV to repository...");
    // Could show a success message and navigate back
    setScoringData(null);
  };

  const handleDownloadOptimized = () => {
    // Simulate download of optimized CV
    console.log("Downloading optimized CV...");
    // TODO: Generate and download optimized CV
  };

  if (scoringData) {
    return (
      <div className="flex-1">
        <CVScoringResult
          data={scoringData}
          onBack={handleBackToUpload}
          onSaveToRepository={handleSaveToRepository}
          onDownloadOptimized={handleDownloadOptimized}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-[var(--surface)]">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>Pages</span>
          <span>/</span>
          <span className="text-[var(--neutral-ink)]">Scoring CV Anda</span>
        </div>
        <h1 className="text-3xl font-poppins font-bold text-[var(--neutral-ink)] mb-2">
          CV Scoring & Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Upload CV Anda untuk mendapatkan analisis mendalam dan saran perbaikan
          dari AI
        </p>
      </div>

      {/* Features Cards */}

      {/* Upload Zone */}
      <Card className="border border-[var(--border-color)] mb-8">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-[var(--red-normal)]" />
            <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
              Upload CV untuk Analisis
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FileUploadZone
            onFileUpload={handleCVUpload}
            isProcessing={isProcessing}
            acceptedTypes={[".pdf", ".docx", ".doc"]}
            maxSize={10}
          />
        </CardContent>
      </Card>

      {/* Process Info */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Proses analisis membutuhkan waktu 3-5 detik. AI kami akan menganalisis
          format, konten, dan kompatibilitas ATS dari CV Anda.
        </p>
      </div>
    </div>
  );
}
