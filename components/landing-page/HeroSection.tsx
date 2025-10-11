// components/landing-page/HeroSection.tsx

import { useState } from "react";
import { Button } from "../ui/button";
import { FileUploadZone } from "../FileUploadZone";
import { CVScoringData } from "../../src/utils/cvScoringService";
import { Upload, FileText } from "lucide-react";
import { RadialScore } from "../RadialScore";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Image from "next/image";

interface HeroSectionProps {
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
  onStartNow?: () => void;
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
  onStartNow,
  scoringData,
  onResetScoring,
  onSaveToRepository,
  onDownloadOptimized,
  hasTriedScoring = false,
  isAuthenticated = false,
}: HeroSectionProps) {
  const [isHighlighting, setIsHighlighting] = useState(false);

  const handleTriggerHighlight = () => {
    setIsHighlighting(true);
    setTimeout(() => {
      setIsHighlighting(false);
    }, 500); // Highlight for 1 second
  };

  return (
    <section className="bg-gradient-to-br from-[var(--surface)] to-[var(--red-light)] py-10  2xl:py-20 px-6 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center  ">
          <div className="space-y-8 ">
            <div className="space-y-4 ">
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
                onClick={onStartNow}
              >
                Mulai Sekarang
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
                onClick={handleTriggerHighlight}
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
                isHighlighted={isHighlighting}
              />
            </div>
          </div>
          <div className="flex justify-center  ">
            <div className="relative w-full max-w-2xl h-[500px] lg:h-[600px]">
              {/* Background blob shape - positioned behind image */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 0 }}
              >
                <svg
                  viewBox="0 0 600 600"
                  className="w-full h-full"
                  style={{
                    animation: "blob-morph 8s ease-in-out infinite",
                  }}
                >
                  <defs>
                    <linearGradient
                      id="blobGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#F6E8EC", stopOpacity: 1 }}
                      />
                      <stop
                        offset="50%"
                        style={{ stopColor: "#E2B8C5", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#A21944", stopOpacity: 0.4 }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 300 80 C 380 60 470 100 510 180 C 550 260 540 360 490 440 C 440 520 340 560 250 540 C 160 520 80 460 70 360 C 60 260 120 140 200 100 C 240 80 260 90 300 80 Z"
                    fill="url(#blobGradient)"
                  />
                </svg>
              </div>

              {/* Professional image - positioned on top of blob */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 1 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/professional-man.png"
                    alt="Profesional dengan Laptop"
                    fill
                    className="object-contain object-bottom rounded-xl -translate-y-10"
                    style={{
                      filter: "drop-shadow(0 25px 50px rgba(162, 25, 68, 0.2))",
                    }}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
