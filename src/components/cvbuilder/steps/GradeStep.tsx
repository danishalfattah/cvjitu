import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { RadialScore } from "../../RadialScore";
import {
  Bot,
  RefreshCw,
  Edit,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { CVBuilderData, CVGrade } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Language, t } from "@/lib/translations"; // Import t dan Language

// 1. Perbarui interface props untuk menerima onAnalysisChange
interface GradeStepProps {
  data: CVBuilderData;
  onAnalysisChange: (isAnalyzing: boolean) => void;
  initialGrade?: CVGrade | null; // Prop baru untuk data analisis awal
  onAnalysisComplete: (grade: CVGrade | null) => void; // Prop baru untuk mengirim hasil
  lang: Language;
}

export function GradeStep({
  data,
  onAnalysisChange,
  initialGrade,
  onAnalysisComplete,
  lang,
}: GradeStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [grade, setGrade] = useState<CVGrade | null>(null);
  const [progress, setProgress] = useState(0); // 1. State baru untuk progress

  useEffect(() => {
    if (initialGrade) {
      setGrade(initialGrade);
    }
  }, [initialGrade]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isAnalyzing) {
      setProgress(10); // Mulai dari 10% agar tidak terasa lambat di awal
      timer = setInterval(() => {
        setProgress((prev) => {
          // Berhenti di 90% untuk menunggu hasil fetch yang sebenarnya
          if (prev >= 95) {
            return 95;
          }
          // Tambahkan nilai acak kecil untuk membuatnya terlihat lebih natural
          return prev + Math.random() * 2;
        });
      }, 50); // Update setiap 400ms
    } else {
      // Jika analisis selesai (sukses atau gagal), set progress ke 100% sebentar lalu reset
      if (progress > 0) {
        setProgress(100);
        setTimeout(() => setProgress(0), 500);
      }
    }

    // 3. Cleanup function untuk membersihkan interval
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isAnalyzing]);

  const analyzeCV = async () => {
    setIsAnalyzing(true);
    onAnalysisChange(true);
    setGrade(null);

    try {
      const response = await fetch("/api/score-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("toastAnalysisFailed", lang));
      }

      const result: CVGrade = await response.json();
      setGrade(result);
      onAnalysisComplete(result); // **PERBAIKAN 2: Kirim hasil ke parent**
      toast.success(t("toastAnalysisSuccess", lang));
    } catch (error: any) {
      console.error("Analysis Error:", error);
      toast.error(error.message || t("toastAnalysisError", lang));
      onAnalysisComplete(null); // Kirim null jika gagal
    } finally {
      setIsAnalyzing(false);
      onAnalysisChange(false);
    }
  };

  // Helper Functions untuk UI
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "good":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "average":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "needs_improvement":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "average":
        return "bg-yellow-100 text-yellow-800";
      case "needs_improvement":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return t("gradeStatusExcellent", lang);
      case "good":
        return t("gradeStatusGood", lang);
      case "average":
        return t("gradeStatusAverage", lang);
      case "needs_improvement":
        return t("gradeStatusNeedsImprovement", lang);
      default:
        return status;
    }
  };

  if (!grade && !isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-[var(--red-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="w-10 h-10 text-[var(--red-normal)]" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--neutral-ink)] mb-2">
            {t("gradeAiAnalysisTitle", lang)}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {t("gradeAiAnalysisDesc", lang)}
          </p>
          <Button
            onClick={analyzeCV}
            className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
            size="lg"
          >
            <Bot className="w-5 h-5 mr-2" />
            {t("gradeAnalyzeButton", lang)}
          </Button>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-[var(--red-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-10 h-10 text-[var(--red-normal)] animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--neutral-ink)] mb-2">
            {t("gradeAnalyzingTitle", lang)}
          </h3>
          <p className="text-gray-600 mb-6">{t("gradeAnalyzingDesc", lang)}</p>
          <Progress value={progress} className="w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return grade ? (
    <div className="space-y-6">
      <Card className="border border-[var(--border-color)]">
        <CardHeader>
          <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
            {t("gradeOverallScore", lang)}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <RadialScore
              score={grade.overallScore}
              size="lg"
              showLabel={true}
              lang={lang}
            />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {t("gradeAtsCompatibility", lang)}
                </span>
                <span className="text-sm font-bold text-[var(--neutral-ink)]">
                  {grade.atsCompatibility}%
                </span>
              </div>
              <Progress value={grade.atsCompatibility} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {t("gradeKeywordMatch", lang)}
                </span>
                <span className="text-sm font-bold text-[var(--neutral-ink)]">
                  {grade.keywordMatch}%
                </span>
              </div>
              <Progress value={grade.keywordMatch} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {t("gradeReadability", lang)}
                </span>
                <span className="text-sm font-bold text-[var(--neutral-ink)]">
                  {grade.readabilityScore}%
                </span>
              </div>
              <Progress value={grade.readabilityScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[var(--border-color)]">
        <CardHeader>
          <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
            {t("gradeSectionAnalysis", lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grade.sections.map((section, index) => (
              <div
                key={index}
                className="border border-[var(--border-color)] rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(section.status)}
                    <h3 className="font-medium text-[var(--neutral-ink)]">
                      {section.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={cn(
                        getStatusColor(section.status),
                        "font-medium"
                      )}
                    >
                      {getStatusText(section.status)}
                    </Badge>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[var(--neutral-ink)]">
                        {section.score}
                      </span>
                      <span className="text-sm text-gray-600">/100</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{section.feedback}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[var(--border-color)]">
        <CardHeader>
          <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
            {t("gradeSuggestions", lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {grade.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-[var(--red-light)] rounded-lg"
              >
                <Edit className="w-5 h-5 text-[var(--red-normal)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--neutral-ink)]">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center pt-2">
        <Button
          onClick={analyzeCV}
          variant="outline"
          className="border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t("gradeReanalyzeButton", lang)}
        </Button>
      </div>
    </div>
  ) : null;
}
