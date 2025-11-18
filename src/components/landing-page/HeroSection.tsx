// components/landing-page/HeroSection.tsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { FileUploadZone } from "../FileUploadZone";
import Image from "next/image";
import { Sparkles, Upload, TrendingUp } from "lucide-react";
import { type CVScoringData } from "../../app/page";

interface HeroSectionProps {
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
  onStartNow?: () => void;
  scoringData?: any | null;
  onResetScoring?: () => void;
  onSaveToRepository?: () => void;
  isAuthenticated?: boolean;
  onAuthAction?: () => void;
  simplifiedView?: boolean;
}

export function HeroSection({
  onFileUpload,
  isProcessing = false,
  onStartNow,
  scoringData,
  onResetScoring,
  onSaveToRepository,
  isAuthenticated = false,
  onAuthAction,
  simplifiedView = false,
}: HeroSectionProps) {
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [liveCount, setLiveCount] = useState(1234);

  // Simulate live user count changing
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerHighlight = () => {
    setIsHighlighting(true);
    setTimeout(() => {
      setIsHighlighting(false);
    }, 1000);
  };

  return (
    <section className="relative bg-gradient-to-br from-[var(--surface)] via-white to-[var(--red-light)] py-20 px-6 overflow-hidden">
      {/* Animated background overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--red-light)] rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--red-light)] rounded-full blur-3xl animate-float delay-300" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Live Activity Counter */}
            <motion.div
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-white/50 shadow-sm"
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.2,
              }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-gentle-pulse" />
              <span className="text-sm font-medium text-gray-700">
                <strong className="text-[var(--red-normal)]">
                  {liveCount.toLocaleString()}
                </strong>{" "}
                orang sedang membuat CV sekarang
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.4,
              }}
            >
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-poppins font-bold text-[var(--neutral-ink)] leading-tight">
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Bangun CV Kuat,
                </motion.span>{" "}
                <br />
                <span className="text-[var(--red-normal)]">
                  Raih Pekerjaan{" "}
                  <motion.span
                    className="relative inline-block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.7,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    Layak
                    {/* Subtle underline decoration - only under "Layak" */}
                    <motion.svg
                      className="absolute top-full mt-1 left-0 w-full"
                      height="12"
                      viewBox="0 0 100 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.45 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    >
                      <motion.path
                        d="M3 8 Q 20 3 50 2 Q 80 3 97 8"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </motion.svg>
                  </motion.span>
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                Platform bertenaga{" "}
                <span className="font-semibold text-[var(--red-normal)]">
                  AI
                </span>{" "}
                untuk membuat CV profesional dengan scoring otomatis dan saran
                optimasi. Tingkatkan peluang karir Anda dengan CV yang ramah
                ATS.
              </p>
            </motion.div>

            {/* CTA Buttons - Dual Strategy */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.6,
              }}
            >
              <Button
                size="lg"
                className="group relative bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white px-8 shadow-lg hover:shadow-xl transition-smooth hover:-translate-y-1"
                onClick={onStartNow}
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Buat CV Baru
                <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)] px-8 shadow-md hover:shadow-lg transition-smooth hover:-translate-y-1"
                onClick={handleTriggerHighlight}
              >
                <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                Score CV Saya
              </Button>
            </motion.div>

            {/* Upload Zone - Enhanced Glassmorphism */}
            <motion.div
              className="glass-strong rounded-2xl p-6 shadow-xl glow-red-soft"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.8,
              }}
            >
              <FileUploadZone
                onFileSelect={onFileUpload}
                isProcessing={isProcessing}
                scoringData={scoringData}
                onResetScoring={onResetScoring}
                onSaveToRepository={onSaveToRepository}
                isAuthenticated={isAuthenticated}
                isHighlighted={isHighlighting}
                onAuthAction={onAuthAction}
                simplifiedView={true}
              />
            </motion.div>
          </div>

          {/* Right Column - Visual */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: 0.3,
            }}
          >
            <div className="relative w-full max-w-2xl h-[500px] lg:h-[650px]">
              {/* Multi-layered animated blobs */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Background blob layer 1 */}
                <svg
                  viewBox="0 0 600 600"
                  className="absolute w-full h-full opacity-40 animate-blob-morph"
                  style={{ animationDelay: "0s" }}
                >
                  <defs>
                    <linearGradient
                      id="blobGradient1"
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
                        style={{ stopColor: "#A21944", stopOpacity: 0.6 }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 300 80 C 380 60 470 100 510 180 C 550 260 540 360 490 440 C 440 520 340 560 250 540 C 160 520 80 460 70 360 C 60 260 120 140 200 100 C 240 80 260 90 300 80 Z"
                    fill="url(#blobGradient1)"
                  />
                </svg>

                {/* Background blob layer 2 - slower animation */}
                <svg
                  viewBox="0 0 600 600"
                  className="absolute w-[90%] h-[90%] opacity-30 animate-blob-morph"
                  style={{ animationDelay: "-4s", animationDuration: "16s" }}
                >
                  <defs>
                    <linearGradient
                      id="blobGradient2"
                      x1="100%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#A21944", stopOpacity: 0.4 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#F6E8EC", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 300 100 C 360 90 430 120 480 190 C 530 260 520 340 480 410 C 440 480 360 510 280 500 C 200 490 130 440 120 350 C 110 260 150 160 220 120 C 250 100 270 105 300 100 Z"
                    fill="url(#blobGradient2)"
                  />
                </svg>
              </div>

              {/* Professional image - static, no animation */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="relative w-full h-full">
                  <Image
                    src="/professional-man.png"
                    alt="Profesional dengan Laptop"
                    fill
                    className="object-contain object-bottom rounded-xl -translate-y-8"
                    style={{
                      filter:
                        "drop-shadow(0 25px 60px rgba(162, 25, 68, 0.25))",
                    }}
                    priority
                  />
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center animate-float delay-200">
                <Sparkles className="w-10 h-10 text-[var(--red-normal)]" />
              </div>

              <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center animate-float delay-500">
                <TrendingUp className="w-8 h-8 text-[var(--red-normal)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
