"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { StatTile } from "../StatTile";
import { CVFilters } from "./CVFilters";
import { CVCard, CVData } from "./CVCard";
import { CVTable } from "./CVTable";
import { EmptyState } from "../EmptyState";
import { DeleteConfirmModal } from "../DeleteConfirmModal";
import { CVScoringResult } from "./CVScoringResult";
import { CVPreview } from "../cvbuilder/preview/CVPreview";
import { type CVScoringData } from "@/src/utils/cvScoringService";
import { CVBuilderData } from "../cvbuilder/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
} from "../ui/alert-dialog";
import {
  Search,
  Plus,
  Grid,
  List,
  FileText,
  TrendingUp,
  CheckCircle,
  Edit3,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface DashboardProps {
  onCreateCVAction?: (lang: "id" | "en") => void;
}

export function Dashboard({ onCreateCVAction }: DashboardProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "Semua Status",
    year: "Semua Tahun",
    scoreRange: [1, 100],
    sortBy: "newest" as "newest" | "oldest", // Tambahkan state sortBy
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    cv: CVData | null;
  }>({ isOpen: false, cv: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [scoringResult, setScoringResult] = useState<CVScoringData | null>(
    null
  );
  const [selectedCvForPreview, setSelectedCvForPreview] =
    useState<CVData | null>(null);
  const [draftPreviewData, setDraftPreviewData] = useState<CVData | null>(null);

  useEffect(() => {
    const fetchCVs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/cv?type=builder");
        if (!response.ok) throw new Error("Gagal mengambil data CV");
        const data = await response.json();
        setCvs(data);
      } catch (error) {
        toast.error("Gagal memuat data CV Anda.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCVs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const availableYears = useMemo(() => {
    if (!cvs || cvs.length === 0) return [];
    const yearsSet = new Set(cvs.map((cv) => cv.year.toString()));
    return Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));
  }, [cvs]);

  const stats = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const completedCvs = cvs.filter((cv) => cv.status !== "Draft");

    const cvsThisMonth = completedCvs.filter(
      (cv) => new Date(cv.createdAt) > thirtyDaysAgo
    );

    const total = cvs.length;
    const avgScore = Math.round(
      completedCvs.reduce((sum, cv) => sum + (cv.score || 0), 0) /
        (completedCvs.length || 1)
    );
    const completed = completedCvs.length;
    const drafted = total - completed;

    return {
      total,
      avgScore,
      completed,
      drafted,
      newThisMonth: cvs.filter((cv) => new Date(cv.createdAt) > thirtyDaysAgo)
        .length,
      completedThisMonth: cvsThisMonth.length,
    };
  }, [cvs]);

  // --- PERBAIKAN UTAMA DI SINI ---
  const filteredAndSortedCVs = useMemo(() => {
    let filtered = cvs.filter((cv) => {
      const matchesSearch = (cv.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        filters.status === "Semua Status" ||
        (filters.status === "Selesai" && cv.status === "Completed") ||
        (filters.status === "Draf" && cv.status === "Draft");

      const matchesYear =
        filters.year === "Semua Tahun" ||
        (cv.year ? cv.year.toString() === filters.year : false);

      const matchesScore =
        cv.status === "Draft" ||
        ((cv.score || 0) >= filters.scoreRange[0] &&
          (cv.score || 0) <= filters.scoreRange[1]);

      return matchesSearch && matchesStatus && matchesYear && matchesScore;
    });

    // Terapkan pengurutan
    filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return filters.sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [cvs, searchQuery, filters]);
  // --- AKHIR PERBAIKAN ---

  const handleCVAction = (action: string, cv: CVData) => {
    switch (action) {
      case "preview":
        if (cv.status === "Draft") {
          setDraftPreviewData(cv);
        } else {
          const mockResult: CVScoringData = {
            fileName: cv.name,
            overallScore: cv.score,
            atsCompatibility: Math.min(cv.score + 5, 100),
            keywordMatch: Math.max(cv.score - 3, 0),
            readabilityScore: Math.min(cv.score + 2, 100),
            sections: [
              {
                name: "Pengalaman Kerja",
                score: cv.score + 10,
                status: "excellent",
                feedback: "Sangat relevan.",
              },
              {
                name: "Pendidikan",
                score: cv.score - 5,
                status: "good",
                feedback: "Latar belakang baik.",
              },
            ],
            suggestions: ["Tambahkan kata kunci.", "Kuantifikasi pencapaian."],
          };
          setSelectedCvForPreview(cv);
          setScoringResult(mockResult);
        }
        break;
      case "download":
        toast.info("Fitur download akan segera hadir!");
        break;
      case "update":
        router.push(`/cv-builder?id=${cv.id}&lang=${cv.lang || "id"}`);
        break;
      case "share":
        handleShareCV(cv);
        break;
      case "delete":
        setDeleteModal({ isOpen: true, cv });
        break;
    }
  };

  const handleShareCV = (cv: CVData) => {
    if (cv.visibility === "private") {
      toast.warning(
        "Ubah privasi CV menjadi 'Publik' untuk dapat membagikan link."
      );
      return;
    }
    const shareUrl = `${window.location.origin}/cv/${cv.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success(`Link publik CV "${cv.name}" berhasil disalin!`);
    });
  };

  const handleVisibilityChange = async (
    cvId: string,
    visibility: "public" | "private"
  ) => {
    const originalCvs = [...cvs];
    const updatedCvs = cvs.map((cv) =>
      cv.id === cvId ? { ...cv, visibility } : cv
    );
    setCvs(updatedCvs);
    try {
      await fetch(`/api/cv/${cvId}?type=builder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      });
      toast.success("Visibilitas CV berhasil diubah!");
    } catch (error) {
      setCvs(originalCvs);
      toast.error("Gagal mengubah visibilitas CV.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.cv) {
      try {
        const response = await fetch(
          `/api/cv/${deleteModal.cv.id}?type=builder`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Gagal menghapus CV");
        setCvs((prev) => prev.filter((cv) => cv.id !== deleteModal.cv!.id));
        toast.success(`CV "${deleteModal.cv.name}" telah dihapus.`);
      } catch (error) {
        toast.error("Gagal menghapus CV. Silakan coba lagi.");
      } finally {
        setDeleteModal({ isOpen: false, cv: null });
      }
    }
  };

  const resetFilters = () => {
    setFilters({
      status: "Semua Status",
      year: "Semua Tahun",
      scoreRange: [1, 100],
      sortBy: "newest", // Reset juga sortBy
    });
    setCurrentPage(1);
  };

  const handleBackToDashboard = () => {
    setScoringResult(null);
    setSelectedCvForPreview(null);
    setDraftPreviewData(null);
  };

  const handleLanguageSelect = (lang: "id" | "en") => {
    setIsLangModalOpen(false);
    onCreateCVAction
      ? onCreateCVAction(lang)
      : router.push(`/cv-builder?lang=${lang}`);
  };
  const totalPages = Math.ceil(filteredAndSortedCVs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCVs = filteredAndSortedCVs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  if (scoringResult && selectedCvForPreview) {
    const cvBuilderDataFromCv: CVBuilderData = {
      jobTitle: selectedCvForPreview.jobTitle || selectedCvForPreview.name,
      description: selectedCvForPreview.description || "",
      firstName: selectedCvForPreview.firstName || "",
      lastName: selectedCvForPreview.lastName || "",
      email: selectedCvForPreview.email || "",
      phone: selectedCvForPreview.phone || "",
      location: selectedCvForPreview.location || "",
      linkedin: selectedCvForPreview.linkedin || "",
      website: selectedCvForPreview.website || "",
      workExperiences: selectedCvForPreview.workExperiences || [],
      educations: selectedCvForPreview.educations || [],
      skills: selectedCvForPreview.skills || [],
      summary: selectedCvForPreview.summary || "",
    };
    return (
      <CVScoringResult
        data={scoringResult}
        cvBuilderData={cvBuilderDataFromCv}
        onBack={handleBackToDashboard}
        onSaveToRepository={null}
        showPreview={true}
      />
    );
  }

  if (draftPreviewData) {
    return (
      <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)]">
              Pratinjau CV Draf: {draftPreviewData.name}
            </h2>
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="border-[var(--border-color)]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </div>
          <CVPreview
            data={draftPreviewData as CVBuilderData}
            lang={
              draftPreviewData.lang === "unknown" || !draftPreviewData.lang
                ? "id"
                : draftPreviewData.lang
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 bg-[var(--surface)] min-h-screen min-w-0">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>Pages</span>
          <span>/</span>
          <span className="text-[var(--neutral-ink)]">Dashboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
          Dashboard
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatTile
          title="CV Dibuat"
          value={stats.total}
          icon={FileText}
          change={{
            value: `+${stats.newThisMonth} bulan ini`,
            type: "increase",
          }}
        />
        <StatTile
          title="Skor Rata-rata"
          value={stats.avgScore}
          icon={TrendingUp}
          change={{ value: "Dari CV selesai", type: "neutral" }}
        />
        <StatTile
          title="Total Selesai"
          value={stats.completed}
          icon={CheckCircle}
          change={{
            value: `+${stats.completedThisMonth} selesai bulan ini`,
            type: "increase",
          }}
        />
        <StatTile
          title="Total Draf"
          value={stats.drafted}
          icon={Edit3}
          change={{ value: "Perlu diselesaikan", type: "warning" }}
        />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-4">
          Repositori CV Anda
        </h2>
        <CVFilters
          filters={filters}
          years={availableYears} // Kirim tahun dinamis ke CVFilters
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              placeholder="Cari CV Anda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 text-sm sm:text-base"
            />
          </div>
        </div>
        <Button
          onClick={() => setIsLangModalOpen(true)}
          className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat CV
        </Button>
      </div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs sm:text-sm text-gray-600">
          Menampilkan {paginatedCVs.length} dari {filteredAndSortedCVs.length}{" "}
          CV
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
          description="Anda belum membuat CV. Buat CV pertama Anda untuk memulai."
          action={{
            label: "Buat CV Pertama Anda",
            onClick: () => setIsLangModalOpen(true),
          }}
        />
      ) : (
        <>
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {paginatedCVs.map((cv) => (
                <CVCard
                  key={cv.id}
                  cv={cv}
                  onPreview={() => handleCVAction("preview", cv)}
                  onDownload={() => handleCVAction("download", cv)}
                  onUpdate={() => handleCVAction("update", cv)}
                  onDelete={() => handleCVAction("delete", cv)}
                  onShare={() => handleCVAction("share", cv)}
                  onVisibilityChange={handleVisibilityChange}
                />
              ))}
            </div>
          ) : (
            <CVTable
              cvs={paginatedCVs}
              onPreview={handleCVAction}
              onDownload={handleCVAction}
              onUpdate={handleCVAction}
              onDelete={handleCVAction}
              onShare={handleCVAction}
              onVisibilityChange={handleVisibilityChange}
            />
          )}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Math.max(1, currentPage - 1));
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Math.min(totalPages, currentPage + 1));
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, cv: null })}
        onConfirm={handleDeleteConfirm}
        cv={deleteModal.cv}
      />
      <AlertDialog open={isLangModalOpen} onOpenChange={setIsLangModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pilih Bahasa CV</AlertDialogTitle>
            <AlertDialogDescription>
              Silakan pilih bahasa yang ingin Anda gunakan untuk membuat CV
              baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => handleLanguageSelect("id")}
              className="w-full sm:w-auto"
            >
              Bahasa Indonesia
            </Button>
            <Button
              onClick={() => handleLanguageSelect("en")}
              className="w-full sm:w-auto bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
            >
              English
            </Button>
          </div>
          <AlertDialogFooter className="sm:hidden mt-2">
            <AlertDialogCancel className="w-full">Batal</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
