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
  Download,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { CVScoringData } from "../../src/utils/cvScoringService";

interface CVScoringResultProps {
  data: CVScoringData;
  onBack: () => void;
  onSaveToRepository: () => void;
  onDownloadOptimized: () => void;
}

export function CVScoringResult({
  data,
  onBack,
  onSaveToRepository,
  onDownloadOptimized,
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-[var(--border-color)]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-poppins font-bold text-[var(--neutral-ink)]">
                Hasil Analisis CV
              </h1>
              <p className="text-gray-600 flex items-center mt-1">
                <FileText className="w-4 h-4 mr-2" />
                {data.fileName}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onSaveToRepository}
              className="border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Simpan ke Repositori
            </Button>
            <Button
              onClick={onDownloadOptimized}
              className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CV Optimal
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Overall Score */}
          <div className="lg:col-span-1">
            <Card className="border border-[var(--border-color)] mb-6">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
                  Skor Keseluruhan
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <RadialScore
                  score={data.overallScore}
                  size="lg"
                  showLabel={true}
                />
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Kompatibilitas ATS
                      </span>
                      <span className="text-sm font-bold text-[var(--neutral-ink)]">
                        {data.atsCompatibility}%
                      </span>
                    </div>
                    <Progress value={data.atsCompatibility} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Pencocokan Kata Kunci
                      </span>
                      <span className="text-sm font-bold text-[var(--neutral-ink)]">
                        {data.keywordMatch}%
                      </span>
                    </div>
                    <Progress value={data.keywordMatch} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Keterbacaan
                      </span>
                      <span className="text-sm font-bold text-[var(--neutral-ink)]">
                        {data.readabilityScore}%
                      </span>
                    </div>
                    <Progress value={data.readabilityScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section Analysis */}
          <div className="lg:col-span-2">
            <Card className="border border-[var(--border-color)] mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
                  Analisis per Bagian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.sections.map((section, index) => (
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
                      <p className="text-gray-600 text-sm">
                        {section.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="border border-[var(--border-color)]">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
                  Saran Perbaikan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.suggestions.map((suggestion, index) => (
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
    </div>
  );
}
