// src/components/FileUploadZone.tsx

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  X,
  Loader2,
  BarChart3,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import { Button } from "./ui/button";
import { RadialScore } from "./RadialScore";
import { CVScoringData } from "../utils/cvScoringService";

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  scoringData?: CVScoringData | null;
  onResetScoring?: () => void;
  onAuthAction?: () => void; // Menggantikan onSaveToRepository
  hasTriedScoring?: boolean;
  isAuthenticated?: boolean;
  isHighlighted?: boolean;
}

export function FileUploadZone({
  onFileUpload,
  isProcessing = false,
  acceptedTypes = [".pdf", ".docx", ".doc"],
  maxSize = 10,
  scoringData,
  onResetScoring,
  onAuthAction,
  hasTriedScoring = false,
  isAuthenticated = false,
  isHighlighted = false,
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `Tipe file tidak didukung. Gunakan: ${acceptedTypes.join(", ")}`;
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
    [acceptedTypes, maxSize]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files),
    [handleFiles]
  );

  const handleUpload = () => {
    if (selectedFile) onFileUpload(selectedFile);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (onResetScoring) onResetScoring();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // <<< Tampilan Baru Setelah Analisis Selesai >>>
  if (scoringData && scoringData.isCv) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center space-x-3">
          <BarChart3 className="w-5 h-5 text-[var(--red-normal)]" />
          <span className="text-sm font-medium text-gray-700">
            Hasil Analisis CV Anda
          </span>
        </div>

        <RadialScore
          score={scoringData.overallScore}
          size="lg"
          showLabel={true}
        />
        <p className="text-sm text-gray-600">
          <FileText className="w-4 h-4 inline mr-1" />
          {scoringData.fileName}
        </p>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <Button
            onClick={onAuthAction}
            className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
          >
            {isAuthenticated ? (
              <>
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Lihat Detail di Dashboard
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Masuk untuk Lihat Detail
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFile}
            className="w-full"
          >
            Analisis CV Lain
          </Button>
        </div>
      </div>
    );
  }

  // Tampilan Awal dan Proses Upload
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
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept={acceptedTypes.join(",")}
          onChange={handleInputChange}
          disabled={isProcessing}
        />

        {selectedFile && !isProcessing ? (
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
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
            >
              Analisis CV Sekarang
            </Button>
          </div>
        ) : isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-[var(--red-normal)] h-[108px]">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium">Menganalisis CV Anda...</span>
          </div>
        ) : (
          <div className="space-y-4 h-[108px] flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Klik untuk memilih file atau drag & drop
              </p>
              <p className="text-xs text-gray-500">
                Mendukung: {acceptedTypes.join(", ")} (Maks. {maxSize}MB)
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
