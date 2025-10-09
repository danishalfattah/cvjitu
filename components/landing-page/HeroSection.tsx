import { useState } from "react";
import { Button } from "../ui/button";
import { FileUploadZone } from "../FileUploadZone";
import { CVScoringData } from "../../src/utils/cvScoringService";
import { Upload, FileText } from "lucide-react";
import { RadialScore } from "../RadialScore";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface HeroSectionProps {
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
  onTryScoring?: () => void;
  scoringData?: CVScoringData | null;
  onResetScoring?: () => void;
  onSaveToRepository?: () => void;
  onDownloadOptimized?: () => void;
  hasTriedScoring?: boolean;
  isAuthenticated?: boolean;
}

export function HeroSection({
  onFileUpload,
  isProcessing = false,
  onTryScoring,
  scoringData,
  onResetScoring,
  onSaveToRepository,
  onDownloadOptimized,
  hasTriedScoring = false,
  isAuthenticated = false,
}: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-[var(--surface)] to-[var(--red-light)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-poppins font-bold text-[var(--neutral-ink)] leading-tight">
                Bangun CV Kuat, <br />
                <span className="text-[var(--red-normal)] ">
                  Raih Pekerjaan Layak
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Platform bertenaga AI untuk membuat CV profesional dengan
                scoring otomatis dan saran optimasi. Tingkatkan peluang karir
                Anda dengan CV yang ramah ATS.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white px-8"
              >
                Mulai Sekarang
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
                onClick={onTryScoring}
              >
                Coba Scoring
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
              <FileUploadZone
                onFileUpload={onFileUpload}
                isProcessing={isProcessing}
                acceptedTypes={[".pdf", ".docx", ".doc"]}
                maxSize={10}
                scoringData={scoringData}
                onResetScoring={onResetScoring}
                onSaveToRepository={onSaveToRepository}
                onDownloadOptimized={onDownloadOptimized}
                hasTriedScoring={hasTriedScoring}
                isAuthenticated={isAuthenticated}
                onTryScoring={onTryScoring}
              />
            </div>
          </div>

          <div className="flex justify-center ">
            <div className="relative">
              {/* Main illustration card */}
              <div className="bg-gradient-to-br from-[var(--red-light)] to-white rounded-2xl shadow-2xl p-8 max-w-md">
                <div className="text-center mb-6">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1631038506857-6c970dd9ba02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjcmVhdGluZyUyMGN2JTIwd29ya3NwYWNlfGVufDF8fHx8MTc1OTY2MTcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Profesional Membuat CV"
                    className="w-full h-48 object-cover rounded-xl mb-4 shadow-lg"
                  />
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                    <h3 className="font-poppins font-semibold text-[var(--neutral-ink)] mb-1">
                      Buat CV Profesional
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Dengan bantuan AI untuk hasil optimal
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[var(--red-normal)] rounded-full"></div>
                        <span className="text-xs text-gray-500">
                          ATS Friendly
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[var(--success)] rounded-full"></div>
                        <span className="text-xs text-gray-500">
                          Auto Score
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating score indicator */}
              <div className="absolute -top-4 -right-4 bg-[var(--red-normal)] rounded-full p-3 shadow-lg">
                <div className="text-white text-center">
                  <div className="text-lg font-bold">98</div>
                  <div className="text-xs">Score</div>
                </div>
              </div>

              {/* Floating feature badges */}
              <div className="absolute -bottom-6 -left-4 bg-white rounded-full px-4 py-2 shadow-lg border border-[var(--border-color)]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-[var(--neutral-ink)]">
                    AI Powered
                  </span>
                </div>
              </div>

              <div className="absolute -top-6 -left-6 bg-white rounded-full px-4 py-2 shadow-lg border border-[var(--border-color)]">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[var(--red-normal)]" />
                  <span className="text-sm font-medium text-[var(--neutral-ink)]">
                    Template Pro
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
