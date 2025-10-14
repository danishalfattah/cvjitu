"use client";

import { useState, useEffect } from "react";
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
import { type CVScoringData } from "@/src/utils/cvScoringService";
import { CVBuilderData } from "../cvbuilder/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
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
  X,
  Loader2,
} from "lucide-react";

interface DashboardProps {
  onCreateCV?: (lang: "id" | "en") => void;
}

export function Dashboard({ onCreateCV }: DashboardProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "Semua Status",
    year: "Semua Tahun",
    scoreRange: [1, 100],
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    cv: CVData | null;
  }>({ isOpen: false, cv: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // --- PERUBAHAN DI SINI ---
  const [scoringResult, setScoringResult] = useState<CVScoringData | null>(
    null
  );
  const [selectedCvForPreview, setSelectedCvForPreview] =
    useState<CVData | null>(null);
  // --- AKHIR PERUBAHAN ---

  useEffect(() => {
    const fetchCVs = async () => {
      setIsLoading(true);
      try {
        // --- PERBAIKAN DI SINI ---
        const response = await fetch("/api/cv?type=builder");
        // --- AKHIR PERBAIKAN ---
        if (!response.ok) {
          throw new Error("Gagal mengambil data CV");
        }
        const data = await response.json();
        setCvs(data);
      } catch (error) {
        console.error(error);
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

  // --- PERUBAHAN DI SINI ---
  const handleCVAction = (action: string, cv: CVData) => {
    switch (action) {
      case "preview":
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
              feedback: "Pengalaman kerja Anda sangat relevan.",
            },
            {
              name: "Pendidikan",
              score: cv.score - 5,
              status: "good",
              feedback: "Latar belakang pendidikan Anda baik.",
            },
          ],
          suggestions: [
            "Tambahkan lebih banyak kata kunci yang relevan.",
            "Kuantifikasi pencapaian Anda.",
          ],
        };
        setSelectedCvForPreview(cv); // Simpan data CV yang asli
        setScoringResult(mockResult); // Tampilkan hasil skor
        break;
      // ... sisa case tetap sama
      case "download":
        toast.info("Fitur download akan segera hadir!");
        break;
      case "update":
        router.push(`/cv-builder?id=${cv.id}`);
        break;
      case "share":
        handleShareCV(cv);
        break;
      case "delete":
        setDeleteModal({ isOpen: true, cv });
        break;
    }
  };
  // --- AKHIR PERUBAHAN ---

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

  const handleVisibilityChange = (
    cvId: string,
    visibility: "public" | "private"
  ) => {
    // Implementasi PUT request ke backend untuk update visibility
    setCvs((prevCvs) =>
      prevCvs.map((cv) => (cv.id === cvId ? { ...cv, visibility } : cv))
    );
    toast.success("Visibilitas CV berhasil diubah!");
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.cv) {
      try {
        const response = await fetch(`/api/cv/${deleteModal.cv.id}`, {
          method: "DELETE",
        });
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
    });
    setCurrentPage(1);
  };

  const handleBackToDashboard = () => {
    setScoringResult(null);
    setSelectedCvForPreview(null);
  };

  const handleLanguageSelect = (lang: "id" | "en") => {
    setIsLangModalOpen(false);
    if (onCreateCV) {
      onCreateCV(lang);
    } else {
      router.push(`/cv-builder?lang=${lang}`);
    }
  };

  const filteredCVs = cvs.filter((cv) => {
    const matchesSearch = (cv.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filters.status === "Semua Status" ||
      (filters.status === "Selesai" && cv.status === "Completed") ||
      (filters.status === "Draf" && cv.status === "Draft");
    const matchesYear =
      filters.year === "Semua Tahun" || cv.year.toString() === filters.year;
    const matchesScore =
      (cv.score || 0) >= filters.scoreRange[0] &&
      (cv.score || 0) <= filters.scoreRange[1];
    return matchesSearch && matchesStatus && matchesYear && matchesScore;
  });

  const totalPages = Math.ceil(filteredCVs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCVs = filteredCVs.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: cvs.length,
    avgScore: Math.round(
      cvs.reduce((sum, cv) => sum + (cv.score || 0), 0) / (cvs.length || 1)
    ),
    completed: cvs.filter((cv) => cv.status === "Completed").length,
    drafted: cvs.filter((cv) => cv.status === "Draft").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  // --- PERUBAHAN DI SINI ---
  if (scoringResult && selectedCvForPreview) {
    // --- PERBAIKAN DI SINI ---
    const cvBuilderDataFromCv: CVBuilderData = {
      jobTitle: selectedCvForPreview.name,
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
        cvBuilderData={cvBuilderDataFromCv} // Teruskan data yang sudah dikonversi
        onBack={handleBackToDashboard}
        onSaveToRepository={() => {
          toast.success("Hasil analisis CV sudah tersimpan.");
          handleBackToDashboard();
        }}
        showPreview={true}
      />
    );
    // --- AKHIR PERBAIKAN ---
  }
  // --- AKHIR PERUBAHAN ---

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
          change={{ value: "+2 bulan ini", type: "increase" }}
        />
        <StatTile
          title="Skor Rata-rata"
          value={stats.avgScore}
          icon={TrendingUp}
          change={{ value: "+5 poin", type: "increase" }}
        />
        <StatTile
          title="Total Selesai"
          value={stats.completed}
          icon={CheckCircle}
          change={{ value: "+2 selesai bulan ini", type: "increase" }}
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
          <span className="text-sm sm:text-base">Buat CV</span>
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
        <div className="flex items-center">
          <span className="text-xs sm:text-sm text-gray-600">
            Menampilkan {paginatedCVs.length} dari {filteredCVs.length} CV
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className={`${
              viewMode === "cards" ? "bg-[var(--red-normal)] text-white" : ""
            } px-3 py-2`}
          >
            <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={`${
              viewMode === "table" ? "bg-[var(--red-normal)] text-white" : ""
            } px-3 py-2`}
          >
            <List className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
      {paginatedCVs.length === 0 ? (
        <EmptyState
          title="CV Tidak Ditemukan"
          description="Tidak ada CV yang sesuai dengan filter Anda. Coba sesuaikan kriteria pencarian atau buat CV baru untuk memulai."
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
                  onPreview={(cv) => handleCVAction("preview", cv)}
                  onDownload={(cv) => handleCVAction("download", cv)}
                  onUpdate={(cv) => handleCVAction("update", cv)}
                  onDelete={(cv) => handleCVAction("delete", cv)}
                  onShare={(cv) => handleCVAction("share", cv)}
                  onVisibilityChange={handleVisibilityChange}
                />
              ))}
            </div>
          ) : (
            <CVTable
              cvs={paginatedCVs}
              onPreview={(cv) => handleCVAction("preview", cv)}
              onDownload={(cv) => handleCVAction("download", cv)}
              onUpdate={(cv) => handleCVAction("update", cv)}
              onDelete={(cv) => handleCVAction("delete", cv)}
              onShare={(cv) => handleCVAction("share", cv)}
              onVisibilityChange={handleVisibilityChange}
            />
          )}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination className="justify-center">
                <PaginationContent className="flex-wrap gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Math.max(1, currentPage - 1));
                      }}
                      className={`${
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer hover:bg-[var(--red-light)] hover:text-[var(--red-normal)]"
                      } transition-colors`}
                    >
                      Sebelumnya
                    </PaginationPrevious>
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
                        className={`cursor-pointer transition-colors ${
                          currentPage === i + 1
                            ? "bg-[var(--red-normal)] text-white hover:bg-[var(--red-normal-hover)]"
                            : "hover:bg-[var(--red-light)] hover:text-[var(--red-normal)]"
                        }`}
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
                      className={`${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer hover:bg-[var(--red-light)] hover:text-[var(--red-normal)]"
                      } transition-colors`}
                    >
                      Selanjutnya
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages} • {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, filteredCVs.length)} dari{" "}
                  {filteredCVs.length} CV
                </p>
              </div>
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
              baru. Seluruh form dan template akan disesuaikan dengan pilihan
              Anda.
            </AlertDialogDescription>
            <AlertDialogCancel className="absolute top-4 right-4 p-2 rounded-full border-none hover:bg-gray-100">
              <X className="w-4 h-4" />
            </AlertDialogCancel>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => handleLanguageSelect("id")}
              className="w-full sm:w-auto border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
            >
              Bahasa Indonesia
            </Button>
            <Button
              onClick={() => handleLanguageSelect("en")}
              className="w-full sm:w-auto bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
            >
              English
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
