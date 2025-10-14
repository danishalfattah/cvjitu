// src/components/FileUploadZone.tsx

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
import { CVScoringData } from "../utils/cvScoringService";
import { toast } from "sonner";

interface FileUploadZoneProps {
  onFileUpload: (fileIdentifier: { name: string; url: string }) => void;
  isProcessing?: boolean;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  scoringData?: CVScoringData | null;
  onResetScoring?: () => void;
  onSaveToRepository?: () => void; // Untuk navigasi ke dashboard
  isAuthenticated?: boolean;
  isHighlighted?: boolean;
  onAuthAction?: () => void; // Untuk navigasi ke login/dashboard
  simplifiedView?: boolean; // Prop baru untuk mengontrol tampilan
}

export function FileUploadZone({
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
  simplifiedView = false, // Default false
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // ... (semua fungsi lain seperti validateFile, handleFiles, dll tetap sama) ...
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

      // 3. Panggil prop onFileUpload
      toast.success("File berhasil diunggah! Menganalisis...");
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

  // --- PERBAIKAN UTAMA DI SINI ---
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

    // Tampilan detail untuk dashboard (tidak berubah)
    // Jika Anda punya komponen CVScoringResult, panggil di sini
    // Jika tidak, logika lama untuk hasil detail tetap di sini
    return <div>Hasil Analisis Detail (Untuk Dashboard)</div>;
  }
  // --- AKHIR PERBAIKAN ---

  return (
    // ... (kode untuk tampilan upload file tetap sama) ...
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
