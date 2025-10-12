// src/components/dashboard/CVScoringResult.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { RadialScore } from "../RadialScore";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Edit,
  ArrowLeft,
  Save,
} from "lucide-react";
import { CVScoringData } from "../../utils/cvScoringService";

interface CVScoringResultProps {
  data: CVScoringData;
  onBack: () => void;
  onSaveToRepository: () => void;
  isFromRepository: boolean; // <-- Prop baru
}

export function CVScoringResult({
  data,
  onBack,
  onSaveToRepository,
  isFromRepository, // <-- Terima prop baru
}: CVScoringResultProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "good":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "needs_improvement":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "poor":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "needs_improvement":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "Sangat Baik";
      case "good":
        return "Baik";
      case "needs_improvement":
        return "Perlu Perbaikan";
      case "poor":
        return "Kurang";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-4 min-w-0">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-[var(--border-color)] flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Kembali</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-poppins font-bold text-[var(--neutral-ink)] truncate">
                Hasil Analisis CV
              </h1>
              <p className="text-sm text-gray-600 flex items-center mt-1 truncate">
                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{data.fileName}</span>
              </p>
            </div>
          </div>
          {/* Tombol simpan hanya muncul jika bukan dari riwayat */}
          {!isFromRepository && (
            <Button
              onClick={onSaveToRepository}
              className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan ke Repositori
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border border-[var(--border-color)]">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
                Skor Keseluruhan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <RadialScore
                score={data.overallScore || 0}
                size="lg"
                showLabel={true}
              />
              <div className="mt-6 space-y-4 max-w-md mx-auto">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Kompatibilitas ATS
                    </span>
                    <span className="text-sm font-bold text-[var(--neutral-ink)]">
                      {data.atsCompatibility || 0}%
                    </span>
                  </div>
                  <Progress
                    value={data.atsCompatibility || 0}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Pencocokan Kata Kunci
                    </span>
                    <span className="text-sm font-bold text-[var(--neutral-ink)]">
                      {data.keywordMatch || 0}%
                    </span>
                  </div>
                  <Progress value={data.keywordMatch || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Keterbacaan
                    </span>
                    <span className="text-sm font-bold text-[var(--neutral-ink)]">
                      {data.readabilityScore || 0}%
                    </span>
                  </div>
                  <Progress
                    value={data.readabilityScore || 0}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[var(--border-color)]">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
                Analisis per Bagian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.sections?.map((section, index) => (
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
                        <Badge className={getStatusColor(section.status)}>
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
                Saran Perbaikan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.suggestions?.map((suggestion, index) => (
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
        </div>
      </div>
    </div>
  );
}
