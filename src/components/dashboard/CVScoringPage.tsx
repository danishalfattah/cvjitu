"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CVFilters } from "./CVFilters";
import { ScoredCVTable } from "./ScoredCVTable";
import { ScoredCVCard } from "./ScoredCVCard";
import { EmptyState } from "../EmptyState";
import { FileUploadZone } from "../FileUploadZone";
import { CVScoringResult } from "./CVScoringResult";
import { DeleteConfirmModal } from "../DeleteConfirmModal";
import { Search, Grid, List, Loader2 } from "lucide-react";
import { CVData } from "./CVCard";
import { type CVScoringData } from "../../app/page";
import { Language, t } from "@/lib/translations";

interface CVScoringPageProps {
  lang: Language; // Tambahkan prop lang
}

export function CVScoringPage({ lang }: CVScoringPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "Semua Status",
    year: "Semua Tahun",
    scoreRange: [1, 100],
    sortBy: "newest" as "newest" | "oldest",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [scoringResult, setScoringResult] = useState<CVScoringData | null>(
    null
  );
  const [newlyScoredCv, setNewlyScoredCv] = useState<Partial<CVData> | null>(
    null
  );
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    cv: CVData | null;
  }>({ isOpen: false, cv: null });

  useEffect(() => {
    const fetchScoredCVs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/cv?type=uploaded");
        if (!response.ok) throw new Error("Gagal mengambil riwayat scoring.");
        const data = await response.json();
        setCvs(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScoredCVs();
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setScoringResult(null);
    setNewlyScoredCv(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/score-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Gagal mendapatkan analisis dari server."
        );
      }

      const results = await response.json();

      if (!results.isCv) {
        toast.error(results.suggestions[0] || "File yang diunggah bukan CV.");
        return;
      }

      const fullResult: CVScoringData = { fileName: file.name, ...results };
      setScoringResult(fullResult);

      const cvToSave: Partial<CVData> = {
        name: file.name,
        year: new Date().getFullYear(),
        status: "Di Upload",
        score: results.overallScore,
        ...results,
      };
      setNewlyScoredCv(cvToSave);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menganalisis CV.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToRepository = async () => {
    if (!newlyScoredCv) return;

    try {
      const dataToSave = { ...newlyScoredCv, type: "uploaded" };

      const response = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) throw new Error("Gagal menyimpan CV ke database.");

      const savedCv = await response.json();
      setCvs((prev) => [savedCv, ...prev]);
      toast.success(`CV "${savedCv.name}" berhasil dianalisis dan disimpan.`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setScoringResult(null);
      setNewlyScoredCv(null);
    }
  };

  const handleViewResult = (cv: CVData) => {
    const resultData: CVScoringData = {
      fileName: cv.name,
      isCv: true,
      overallScore: cv.score,
      sections: cv.sections || [],
      suggestions: cv.suggestions || [],
      atsCompatibility: cv.atsCompatibility || 0,
      keywordMatch: cv.keywordMatch || 0,
      readabilityScore: cv.readabilityScore || 0,
    };
    setScoringResult(resultData);
    setNewlyScoredCv(cv);
  };

  const handleBackToList = () => {
    setScoringResult(null);
    setNewlyScoredCv(null);
  };

  const handleDelete = (cvToDelete: CVData) => {
    setDeleteModal({ isOpen: true, cv: cvToDelete });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.cv) return;
    const originalCvs = [...cvs];
    const cvToDelete = deleteModal.cv;
    setCvs((prev) => prev.filter((cv) => cv.id !== cvToDelete.id));
    setDeleteModal({ isOpen: false, cv: null });
    try {
      const response = await fetch(`/api/cv/${cvToDelete.id}?type=uploaded`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Gagal menghapus CV dari server.");
      toast.success(`CV "${cvToDelete.name}" telah dihapus.`);
    } catch (error: any) {
      toast.error(error.message);
      setCvs(originalCvs);
    }
  };

  const availableYears = useMemo(() => {
    if (!cvs || cvs.length === 0) return [];
    const yearsSet = new Set(cvs.map((cv) => cv.year.toString()));
    return Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));
  }, [cvs]);

  const filteredAndSortedCVs = useMemo(() => {
    let filtered = cvs.filter((cv) => {
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

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return filters.sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [cvs, searchQuery, filters]);

  // --- PERBAIKAN DI SINI ---
  if (scoringResult) {
    return (
      <CVScoringResult
        data={scoringResult}
        cvBuilderData={null} // Tambahkan prop ini dengan nilai null
        onBack={handleBackToList}
        onSaveToRepository={
          newlyScoredCv && !newlyScoredCv.id ? handleSaveToRepository : null
        }
        showPreview={false}
        lang={lang}
      />
    );
  }
  // --- AKHIR PERBAIKAN ---

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
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>Pages</span>
          <span>/</span>
          <span className="text-[var(--neutral-ink)]">Scoring CV</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
          Scoring CV Anda
        </h1>
        <p className="text-gray-600 mt-1">
          Unggah CV baru untuk dianalisis atau lihat riwayat hasil skor Anda.
        </p>
      </div>
      <div className="mb-8">
        <FileUploadZone
          onFileSelect={handleFileUpload}
          isProcessing={isProcessing}
          simplifiedView={false}
        />
      </div>
      <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-4">
        Repositori Hasil Scoring
      </h2>
      <CVFilters
        filters={filters}
        years={availableYears}
        onFiltersChange={setFilters}
        onReset={() =>
          setFilters({
            status: "Semua Tahun",
            year: "Semua Tahun",
            scoreRange: [1, 100],
            sortBy: "newest",
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
          Menampilkan {filteredAndSortedCVs.length} dari {cvs.length} hasil
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
      {filteredAndSortedCVs.length === 0 ? (
        <EmptyState
          title="Repositori Kosong"
          description="Anda belum mengunggah CV untuk dianalisis. Unggah CV pertama Anda untuk memulai."
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {filteredAndSortedCVs.map((cv) => (
            <ScoredCVCard
              key={cv.id}
              cv={cv}
              onViewAnalysis={handleViewResult}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <ScoredCVTable
          cvs={filteredAndSortedCVs}
          onViewAnalysis={handleViewResult}
          onDelete={handleDelete}
        />
      )}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, cv: null })}
        onConfirm={handleDeleteConfirm}
        cv={deleteModal.cv}
      />
    </div>
  );
}
