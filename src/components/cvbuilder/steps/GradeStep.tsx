import { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { RadialScore } from "../../RadialScore";
import {
  Bot,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { CVBuilderData } from "../types";

interface GradeStepProps {
  data: CVBuilderData;
}

interface CVGrade {
  overallScore: number;
  sections: {
    content: number;
    formatting: number;
    keywords: number;
    completeness: number;
  };
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export function GradeStep({ data }: GradeStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [grade, setGrade] = useState<CVGrade | null>(null);

  const analyzeCV = async () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock CV grading based on actual data
    const mockGrade: CVGrade = {
      overallScore: calculateOverallScore(),
      sections: {
        content: calculateContentScore(),
        formatting: 85,
        keywords: calculateKeywordScore(),
        completeness: calculateCompletenessScore(),
      },
      strengths: generateStrengths(),
      improvements: generateImprovements(),
      recommendations: generateRecommendations(),
    };

    setGrade(mockGrade);
    setIsAnalyzing(false);
  };

  const calculateOverallScore = () => {
    let score = 60; // Base score

    // Add points for completed sections
    if (data.firstName && data.lastName) score += 5;
    if (data.email) score += 5;
    if (data.jobTitle) score += 5;
    if (data.workExperiences.length > 0) score += 10;
    if (data.educations.length > 0) score += 5;
    if (data.skills.length > 0) score += 5;
    if (data.summary) score += 5;

    return Math.min(score, 95);
  };

  const calculateContentScore = () => {
    let score = 60;
    if (data.summary && data.summary.length > 100) score += 15;
    if (data.workExperiences.length > 0) score += 15;
    if (data.workExperiences.some((exp) => exp.achievements.length > 0))
      score += 10;
    return Math.min(score, 95);
  };

  const calculateKeywordScore = () => {
    let score = 50;
    const allText = `${data.jobTitle} ${data.summary} ${data.skills.join(
      " "
    )} ${data.workExperiences
      .map((exp) => exp.description + " " + exp.achievements.join(" "))
      .join(" ")}`;

    // Check for common keywords
    const keywords = [
      "experience",
      "skill",
      "project",
      "team",
      "leadership",
      "development",
      "management",
    ];
    const foundKeywords = keywords.filter((keyword) =>
      allText.toLowerCase().includes(keyword)
    );
    score += foundKeywords.length * 5;

    return Math.min(score, 90);
  };

  const calculateCompletenessScore = () => {
    let score = 0;
    const totalSections = 7;
    let completedSections = 0;

    if (data.firstName && data.lastName) completedSections++;
    if (data.email) completedSections++;
    if (data.jobTitle) completedSections++;
    if (data.workExperiences.length > 0) completedSections++;
    if (data.educations.length > 0) completedSections++;
    if (data.skills.length > 0) completedSections++;
    if (data.summary) completedSections++;

    score = (completedSections / totalSections) * 100;
    return Math.round(score);
  };

  const generateStrengths = () => {
    const strengths = [];

    if (data.workExperiences.length > 0) {
      strengths.push("Bagian pengalaman kerja yang kuat");
    }
    if (data.skills.length >= 5) {
      strengths.push("Daftar keahlian yang komprehensif");
    }
    if (data.summary && data.summary.length > 100) {
      strengths.push("Ringkasan profesional yang detail");
    }
    if (data.educations.length > 0) {
      strengths.push("Latar belakang pendidikan tercantum");
    }

    if (strengths.length === 0) {
      strengths.push("Struktur informasi dasar sudah ada");
    }

    return strengths;
  };

  const generateImprovements = () => {
    const improvements = [];

    if (!data.summary || data.summary.length < 50) {
      improvements.push("Tambahkan ringkasan profesional yang lebih detail");
    }
    if (data.workExperiences.length === 0) {
      improvements.push("Sertakan pengalaman kerja yang relevan");
    }
    if (data.skills.length < 5) {
      improvements.push("Tambahkan lebih banyak keahlian yang relevan");
    }
    if (data.workExperiences.some((exp) => exp.achievements.length === 0)) {
      improvements.push("Tambahkan pencapaian spesifik pada pengalaman kerja");
    }
    if (!data.phone) {
      improvements.push("Pertimbangkan menambahkan nomor telepon untuk kontak");
    }

    return improvements.slice(0, 4); // Limit to 4 improvements
  };

  const generateRecommendations = () => {
    return [
      "Gunakan kata kerja aktif seperti 'Memimpin', 'Mengembangkan', 'Menerapkan' dalam deskripsi pengalaman",
      "Kuantifikasi pencapaian Anda dengan angka dan persentase spesifik jika memungkinkan",
      "Sesuaikan kata kunci dengan deskripsi pekerjaan yang Anda lamar",
      "Buat CV 1-2 halaman untuk keterbacaan optimal",
      "Gunakan format yang konsisten di seluruh CV Anda",
    ];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  if (!grade && !isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-[var(--red-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="w-10 h-10 text-[var(--red-normal)]" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--neutral-ink)] mb-2">
            Analisis CV AI
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Dapatkan feedback instan untuk CV Anda dengan analisis bertenaga AI.
            Terima rekomendasi personal untuk meningkatkan efektivitas CV Anda.
          </p>
          <Button
            onClick={analyzeCV}
            className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
            size="lg"
          >
            <Bot className="w-5 h-5 mr-2" />
            Analisis CV Saya
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
            Menganalisis CV Anda...
          </h3>
          <p className="text-gray-600 mb-6">
            AI kami sedang meninjau konten dan struktur CV Anda. Mohon tunggu
            sebentar.
          </p>
          <Progress value={66} className="w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border-[var(--border-color)]">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Target className="w-5 h-5 text-[var(--red-normal)]" />
            CV Score
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex justify-center mb-4">
            <RadialScore score={grade!.overallScore} size="lg" />
          </div>
          <Badge
            variant={getScoreBadgeVariant(grade!.overallScore)}
            className="text-lg px-4 py-1"
          >
            {grade!.overallScore >= 80
              ? "Sangat Baik"
              : grade!.overallScore >= 60
              ? "Baik"
              : "Perlu Perbaikan"}
          </Badge>
        </CardContent>
      </Card>

      {/* Section Scores */}
      <Card className="border-[var(--border-color)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--red-normal)]" />
            Rincian Bagian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(grade!.sections).map(([section, score]) => {
            const sectionNames: Record<string, string> = {
              content: "Konten",
              formatting: "Format",
              keywords: "Kata Kunci",
              completeness: "Kelengkapan",
            };

            return (
              <div key={section} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {sectionNames[section] || section}
                  </span>
                  <span className={`font-semibold ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card className="border-[var(--border-color)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Kekuatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {grade!.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Improvements */}
      <Card className="border-[var(--border-color)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-5 h-5" />
            Area yang Perlu Diperbaiki
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {grade!.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-[var(--border-color)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Bot className="w-5 h-5" />
            Rekomendasi AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {grade!.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600">
                    {index + 1}
                  </span>
                </div>
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Re-analyze Button */}
      <div className="text-center">
        <Button
          onClick={analyzeCV}
          variant="outline"
          className="border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Analisis Ulang CV
        </Button>
      </div>
    </div>
  );
}
