// src/components/dashboard/CVScoringPage.tsx (UPDATED & FIXED)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CVFilters } from "./CVFilters";
import { CVCard, CVData } from "./CVCard";
import { CVTable } from "./CVTable";
import { EmptyState } from "../EmptyState";
import { FileUploadZone } from "../FileUploadZone";
import { CVScoringResult } from "./CVScoringResult";
import {
  analyzeCVFile,
  type CVScoringData,
} from "@/src/utils/cvScoringService";
import { CVBuilderData } from "../cvbuilder/types";
import { Search, Grid, List, Loader2 } from "lucide-react";

export function CVScoringPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  // State ini sekarang hanya untuk halaman scoring, dimulai dengan array kosong
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading hanya untuk aksi, bukan load halaman
  const [filters, setFilters] = useState({
    status: "Semua Status",
    year: "Semua Tahun",
    scoreRange: [1, 100],
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [scoringResult, setScoringResult] = useState<CVScoringData | null>(
    null
  );
  const [newlyScoredCv, setNewlyScoredCv] = useState<CVData | null>(null);

  useEffect(() => {
    const fetchUploadedCVs = async () => {
      setIsLoading(true);
      try {
        // --- PERBAIKAN DI SINI ---
        const response = await fetch("/api/cv?type=uploaded");
        // --- AKHIR PERBAIKAN ---
        if (!response.ok) {
          throw new Error("Gagal mengambil riwayat scoring.");
        }
        const data = await response.json();
        setCvs(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUploadedCVs();
  }, []);

  const handleFileUpload = async (fileIdentifier: {
    name: string;
    url: string;
  }) => {
    setIsProcessing(true);
    setScoringResult(null);
    setNewlyScoredCv(null);
    try {
      const dummyFile = new File([""], fileIdentifier.name, {
        type: "application/pdf",
      });
      const results = await analyzeCVFile(dummyFile);
      setScoringResult(results);

      const newCV: CVData = {
        id: `temp-${Date.now()}`,
        name: fileIdentifier.name,
        year: new Date().getFullYear(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "Uploaded",
        score: results.overallScore,
        lang: "unknown",
        visibility: "private",
        // fileUrl: fileIdentifier.url
      };
      setNewlyScoredCv(newCV);
    } catch (error) {
      toast.error("Gagal menganalisis CV. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToRepository = async () => {
    if (newlyScoredCv) {
      try {
        // --- PERBAIKAN DI SINI ---
        const dataToSave = { ...newlyScoredCv, type: "uploaded" }; // Tambahkan tipe
        const response = await fetch("/api/cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });
        // --- AKHIR PERBAIKAN ---

        if (!response.ok) {
          throw new Error("Gagal menyimpan CV ke database.");
        }

        const savedCv = await response.json();
        setCvs((prev) => [savedCv, ...prev]);
        toast.success(`CV "${savedCv.name}" berhasil disimpan.`);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setScoringResult(null);
        setNewlyScoredCv(null);
      }
    }
  };

  const handleViewResult = (cv: CVData) => {
    toast.info("Membuka detail analisis CV yang sudah tersimpan...");
  };

  const handleBackToList = () => {
    setScoringResult(null);
    setNewlyScoredCv(null);
  };

  const handleDelete = (cvToDelete: CVData) => {
    setCvs((prev) => prev.filter((cv) => cv.id !== cvToDelete.id));
    toast.success(
      `CV "${cvToDelete.name}" telah dihapus dari daftar sesi ini.`
    );
  };

  // Filter hanya dari state 'cvs' lokal halaman ini
  const filteredCVs = cvs.filter((cv) => {
    const matchesSearch = (cv.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear =
      filters.year === "Semua Tahun" ||
      (cv.year ? cv.year.toString() === filters.year : false);
    const matchesScore =
      (cv.score || 0) >= filters.scoreRange[0] &&
      (cv.score || 0) <= filters.scoreRange[1];
    return matchesSearch && matchesYear && matchesScore;
  });

  if (scoringResult) {
    return (
      <CVScoringResult
        data={scoringResult}
        cvBuilderData={null}
        onBack={handleBackToList}
        onSaveToRepository={handleSaveToRepository}
        showPreview={false}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
          Scoring CV Anda
        </h1>
        <p className="text-gray-600 mt-1">
          Unggah CV baru untuk dianalisis. Hasil akan ditampilkan di bawah ini
          untuk sesi ini saja.
        </p>
      </div>

      <div className="mb-8">
        <FileUploadZone
          onFileUpload={handleFileUpload}
          isProcessing={isProcessing}
        />
      </div>

      <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-4">
        Repositori Hasil Scoring (Sesi Ini)
      </h2>

      <CVFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() =>
          setFilters({
            status: "Semua Status",
            year: "Semua Tahun",
            scoreRange: [1, 100],
          })
        }
        hideStatusFilter={true}
      />
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <Input
            placeholder="Cari nama file CV..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-xs sm:text-sm text-gray-600">
          Menampilkan {filteredCVs.length} dari {cvs.length} hasil
        </span>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className={`${
              viewMode === "cards" ? "bg-[var(--red-normal)] text-white" : ""
            }`}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={`${
              viewMode === "table" ? "bg-[var(--red-normal)] text-white" : ""
            }`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {filteredCVs.length === 0 ? (
        <EmptyState
          title="Repositori Sesi Kosong"
          description="Anda belum mengunggah CV untuk dianalisis pada sesi ini. Unggah CV untuk memulai."
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCVs.map((cv) => (
            <CVCard
              key={cv.id}
              cv={cv}
              actionType="scoring"
              onPreview={() => {}}
              onDelete={handleDelete}
              onScore={() => {}}
              onDownload={() => {}}
              onUpdate={() => {}}
              onShare={() => {}}
              onVisibilityChange={() => {}}
            />
          ))}
        </div>
      ) : (
        <CVTable
          cvs={filteredCVs}
          actionType="scoring"
          onPreview={() => {}}
          onDelete={handleDelete}
          onScore={() => {}}
          onDownload={() => {}}
          onUpdate={() => {}}
          onShare={() => {}}
          onVisibilityChange={() => {}}
        />
      )}
    </div>
  );
}
