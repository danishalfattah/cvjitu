// src/components/FileUploadZone.tsx

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  X,
  Loader2,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  ArrowLeft,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { RadialScore } from "./RadialScore";
import { CVScoringData } from "../utils/cvScoringService";
import { toast } from "sonner";

interface FileUploadZoneProps {
  onFileUpload: (fileIdentifier: { name: string; url: string }) => void;
  isProcessing?: boolean;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  scoringData?: CVScoringData | null;
  onResetScoring?: () => void;
  onSaveToRepository?: () => void;
  onDownloadOptimized?: () => void;
  hasTriedScoring?: boolean;
  isAuthenticated?: boolean;
  onTryScoring?: () => void;
  isHighlighted?: boolean;
  onAuthAction?: () => void;
}

export function FileUploadZone({
  onFileUpload,
  isProcessing = false,
  acceptedTypes = [".pdf", ".docx", ".doc"],
  maxSize = 10,
  scoringData,
  onResetScoring,
  onSaveToRepository,
  onDownloadOptimized,
  hasTriedScoring = false,
  isAuthenticated = false,
  onTryScoring,
  isHighlighted = false,
  onAuthAction,
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Dapatkan presigned URL dari backend
      const presignedUrlResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        }),
      });

      if (!presignedUrlResponse.ok) {
        throw new Error("Gagal mendapatkan izin untuk mengunggah file.");
      }

      const { url, fileName: uniqueFileName } =
        await presignedUrlResponse.json();

      // 2. Unggah file langsung ke Cloudflare R2 menggunakan presigned URL
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Gagal mengunggah file ke penyimpanan.");
      }

      // 3. Panggil prop onFileUpload dengan nama file unik dan URL-nya
      toast.success("File berhasil diunggah!");
      const publicUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN}/${uniqueFileName}`;
      onFileUpload({ name: selectedFile.name, url: publicUrl });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat mengunggah.");
      toast.error(err.message || "Terjadi kesalahan saat mengunggah.");
    } finally {
      setIsUploading(false);
    }
  };

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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "good":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "needs_improvement":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "poor":
        return <XCircle className="w-4 h-4 text-red-600" />;
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

  if (scoringData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-[var(--red-normal)]" />
            <span className="text-sm font-medium text-gray-700">
              Hasil Analisis CV
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetScoring}
            className="text-gray-500 hover:text-[var(--red-normal)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Upload Ulang
          </Button>
        </div>
        <div className="text-center py-6 border-b border-gray-200">
          <RadialScore
            score={scoringData.overallScore}
            size="lg"
            showLabel={true}
          />
          <p className="text-sm text-gray-600 mt-2">
            <FileText className="w-4 h-4 inline mr-1" />
            {scoringData.fileName}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--neutral-ink)]">
              {scoringData.atsCompatibility}%
            </div>
            <div className="text-xs text-gray-600">ATS Compatible</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--neutral-ink)]">
              {scoringData.keywordMatch}%
            </div>
            <div className="text-xs text-gray-600">Keyword Match</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--neutral-ink)]">
              {scoringData.readabilityScore}%
            </div>
            <div className="text-xs text-gray-600">Readability</div>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Analisis Bagian CV:
          </h4>
          {scoringData.sections.slice(0, 3).map((section, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                {getStatusIcon(section.status)}
                <span className="text-sm font-medium text-[var(--neutral-ink)]">
                  {section.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(section.status)}>
                  {getStatusText(section.status)}
                </Badge>
                <span className="text-sm font-bold text-[var(--neutral-ink)]">
                  {section.score}
                </span>
              </div>
            </div>
          ))}
          {scoringData.sections.length > 3 && (
            <p className="text-xs text-gray-500 text-center">
              +{scoringData.sections.length - 3} bagian lainnya
            </p>
          )}
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Saran Utama:</h4>
          {scoringData.suggestions.slice(0, 2).map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 p-3 bg-[var(--red-light)] rounded-lg"
            >
              <AlertTriangle className="w-4 h-4 text-[var(--red-normal)] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[var(--neutral-ink)]">{suggestion}</p>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-200">
          {isAuthenticated ? (
            <Button
              onClick={onSaveToRepository}
              className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Lihat Dashboard
            </Button>
          ) : (
            <Button
              onClick={onAuthAction}
              variant="outline"
              className="w-full border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login untuk hasil lebih optimal
            </Button>
          )}
        </div>
      </div>
    );
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
          disabled={isUploading || isProcessing}
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
              {!(isUploading || isProcessing) && (
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

            {!(isUploading || isProcessing) && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
              >
                Analisis CV Sekarang
              </Button>
            )}

            {(isUploading || isProcessing) && (
              <div className="flex items-center justify-center space-x-2 text-[var(--red-normal)]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">
                  {isUploading ? "Mengunggah file..." : "Menganalisis..."}
                </span>
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
                Mendukung file: {acceptedTypes.join(", ")} (Maks. {maxSize}MB)
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
