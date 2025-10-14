"use client";
import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  X,
  Loader2,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "./ui/button";
import { RadialScore } from "./RadialScore";
import { toast } from "sonner";
import { type CVScoringData } from "../app/page";
import { CVScoringResult } from "./dashboard/CVScoringResult";

interface FileUploadZoneProps {
  // Prop baru untuk menangani file yang dipilih secara langsung
  onFileSelect?: (file: File) => void;
  // Prop lama, kita jadikan opsional
  onFileUpload?: (fileIdentifier: { name: string; url: string }) => void;
  isProcessing?: boolean;
  acceptedTypes?: string[];
  maxSize?: number;
  scoringData?: CVScoringData | null;
  onResetScoring?: () => void;
  onSaveToRepository?: () => void;
  isAuthenticated?: boolean;
  isHighlighted?: boolean;
  onAuthAction?: () => void;
  simplifiedView?: boolean;
}

export function FileUploadZone({
  onFileSelect,
  onFileUpload,
  isProcessing = false,
  acceptedTypes = [".pdf", ".docx", ".doc"],
  maxSize = 10,
  scoringData,
  onResetScoring,
  onSaveToRepository,
  isAuthenticated = false,
  isHighlighted = false,
  onAuthAction,
  simplifiedView = false,
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    // Memperluas tipe file yang diterima sesuai dengan kemampuan Gemini
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Tipe file tidak didukung. Gunakan: PDF, DOCX";
    }
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `Ukuran file terlalu besar. Maksimal ${maxSize}MB`;
    }
    return null;
  };

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
    },
    [maxSize]
  );

  const handleAnalyze = () => {
    if (!selectedFile) return;
    // Panggil onFileSelect jika ada (untuk alur baru)
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (scoringData) {
    // Tampilan sederhana untuk Hero Section
    if (simplifiedView) {
      return (
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Skor CV Anda</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetScoring}
              className="text-xs text-gray-500"
            >
              Coba Lagi
            </Button>
          </div>
          <RadialScore
            score={scoringData.overallScore}
            size="lg"
            showLabel={true}
          />
          <div className="text-center space-y-4">
            {isAuthenticated ? (
              <>
                <p className="font-medium text-gray-700">
                  Lihat analisis lengkap dan simpan hasil di akun Anda.
                </p>
                <Button
                  onClick={onSaveToRepository}
                  className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Ke Dashboard
                </Button>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-700">
                  Login untuk lihat analisis lebih detail!
                </p>
                <Button
                  onClick={onAuthAction}
                  className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Masuk atau Daftar Gratis
                </Button>
              </>
            )}
          </div>
        </div>
      );
    }

    // --- PERBAIKAN DI SINI ---
    // Tampilan detail untuk Dashboard
    return (
      <CVScoringResult
        data={scoringData}
        onBack={onResetScoring!}
        onSaveToRepository={onSaveToRepository!}
        showPreview={false}
        cvBuilderData={null}
      />
    );
    // --- AKHIR PERBAIKAN ---
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-4">
        <Upload className="w-5 h-5 text-[var(--red-normal)]" />
        <span className="text-sm font-medium text-gray-700">
          Letakkan CV Anda di sini atau klik untuk upload
        </span>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 cursor-pointer ${
          dragActive || isHighlighted
            ? "border-[var(--red-normal)] bg-[var(--red-light)]"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-[var(--red-normal)]"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrop}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleInputChange}
          disabled={isProcessing}
        />

        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <FileText className="w-8 h-8 text-[var(--red-normal)]" />
              <div className="text-left">
                <p className="font-medium text-[var(--neutral-ink)]">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              {!isProcessing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {!isProcessing && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnalyze();
                }}
                className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
              >
                Analisis CV Sekarang
              </Button>
            )}

            {isProcessing && (
              <div className="flex items-center justify-center space-x-2 text-[var(--red-normal)]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Menganalisis...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <FileText className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Klik untuk memilih file atau drag & drop
              </p>
              <p className="text-xs text-gray-500">
                Mendukung file: PDF, DOCX (Maks. {maxSize}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}
    </div>
  );
}
