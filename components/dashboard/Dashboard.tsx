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
} from "lucide-react";
import Image from "next/image";

export const dummyCVs: CVData[] = [
  {
    id: "1",
    name: "CV Frontend Developer",
    year: 2025,
    created: "15 Agu 2024, 14:30",
    updated: "17 Agu 2024, 09:15",
    status: "Completed",
    score: 81,
    lang: "id",
    visibility: "public",
    owner: "1",
  },
  {
    id: "2",
    name: "Resume Backend Engineer",
    year: 2024,
    created: "10 Agu 2024, 16:45",
    updated: "10 Agu 2024, 16:45",
    status: "Completed",
    score: 72,
    lang: "en",
    visibility: "private",
    owner: "1",
  },
  {
    id: "3",
    name: "Portfolio Data Scientist",
    year: 2023,
    created: "12 Agu 2024, 11:20",
    updated: "14 Agu 2024, 13:50",
    status: "Completed",
    score: 90,
    lang: "en",
    visibility: "public",
    owner: "1",
  },
  {
    id: "4",
    name: "CV UI/UX Designer",
    year: 2025,
    created: "08 Agu 2024, 10:15",
    updated: "12 Agu 2024, 15:30",
    status: "Draft",
    score: 65,
    lang: "id",
    visibility: "private",
    owner: "1",
  },
  {
    id: "5",
    name: "Resume Product Manager",
    year: 2022,
    created: "20 Jul 2024, 09:00",
    updated: "20 Jul 2024, 09:00",
    status: "Draft",
    score: 58,
    lang: "id",
    visibility: "private",
    owner: "1",
  },
  {
    id: "6",
    name: "CV Fresh Graduate",
    year: 2025,
    created: "16 Agu 2024, 08:45",
    updated: "16 Agu 2024, 18:20",
    status: "Completed",
    score: 84,
    lang: "en",
    visibility: "public",
    owner: "1",
  },
  {
    id: "7",
    name: "CV React Developer",
    year: 2024,
    created: "28 Jul 2024, 15:20",
    updated: "03 Agu 2024, 11:30",
    status: "Completed",
    score: 85,
    lang: "en",
    visibility: "public",
    owner: "1",
  },
  {
    id: "8",
    name: "Portfolio Machine Learning Engineer",
    year: 2025,
    created: "20 Jul 2024, 10:15",
    updated: "20 Jul 2024, 10:15",
    status: "Draft",
    score: 78,
    lang: "id",
    visibility: "private",
    owner: "1",
  },
  {
    id: "9",
    name: "Resume DevOps Engineer",
    year: 2024,
    created: "18 Jul 2024, 14:45",
    updated: "22 Jul 2024, 16:20",
    status: "Completed",
    score: 92,
    lang: "en",
    visibility: "public",
    owner: "1",
  },
  {
    id: "10",
    name: "CV Senior Frontend",
    year: 2023,
    created: "15 Jul 2024, 09:30",
    updated: "15 Jul 2024, 09:30",
    status: "Draft",
    score: 88,
    lang: "id",
    visibility: "private",
    owner: "1",
  },
  {
    id: "11",
    name: "Portfolio UX Researcher",
    year: 2025,
    created: "12 Jul 2024, 13:15",
    updated: "18 Jul 2024, 10:45",
    status: "Completed",
    score: 76,
    lang: "en",
    visibility: "public",
    owner: "1",
  },
  {
    id: "12",
    name: "Resume Full Stack Developer",
    year: 2024,
    created: "10 Jul 2024, 16:30",
    updated: "10 Jul 2024, 16:30",
    status: "Draft",
    score: 82,
    lang: "id",
    visibility: "private",
    owner: "1",
  },
  {
    id: "13",
    name: "CV Data Analyst",
    year: 2025,
    created: "08 Jul 2024, 11:20",
    updated: "14 Jul 2024, 15:30",
    status: "Completed",
    score: 74,
    lang: "id",
    visibility: "public",
    owner: "1",
  },
  {
    id: "14",
    name: "Portfolio Mobile Developer",
    year: 2024,
    created: "05 Jul 2024, 14:45",
    updated: "05 Jul 2024, 14:45",
    status: "Draft",
    score: 79,
    lang: "en",
    visibility: "private",
    owner: "1",
  },
  {
    id: "15",
    name: "Resume Software Architect",
    year: 2023,
    created: "03 Jul 2024, 09:15",
    updated: "07 Jul 2024, 12:20",
    status: "Completed",
    score: 95,
    lang: "en",
    visibility: "public",
    owner: "1",
  },
  {
    id: "16",
    name: "CV Technical Product Manager",
    year: 2025,
    created: "01 Jul 2024, 17:30",
    updated: "01 Jul 2024, 17:30",
    status: "Draft",
    score: 83,
    lang: "id",
    visibility: "private",
    owner: "1",
  },
  {
    id: "17",
    name: "Portfolio AI Engineer",
    year: 2024,
    created: "28 Jun 2024, 10:45",
    updated: "30 Jun 2024, 14:15",
    status: "Completed",
    score: 91,
    lang: "en",
    visibility: "public",
    owner: "1",
  },
  {
    id: "18",
    name: "Resume QA Engineer",
    year: 2025,
    created: "25 Jun 2024, 16:20",
    updated: "25 Jun 2024, 16:20",
    status: "Draft",
    score: 67,
    lang: "id",
    visibility: "private",
    owner: "1",
  },
];

const mockBuilderData: CVBuilderData = {
  jobTitle: "Software Engineer",
  description: "CV for the position of Software Engineer",
  firstName: "Demo",
  lastName: "User",
  email: "demo@cvjitu.com",
  phone: "08123456789",
  location: "Jakarta, Indonesia",
  linkedin: "linkedin.com/in/demouser",
  website: "demouser.com",
  workExperiences: [
    {
      id: "1",
      jobTitle: "Frontend Developer",
      company: "Tech Corp",
      location: "Jakarta",
      startDate: "2022-01",
      endDate: "2024-01",
      current: false,
      description: "Developing cool stuff.",
      achievements: ["Achieved X", "Improved Y"],
    },
  ],
  educations: [
    {
      id: "1",
      degree: "S.Kom",
      institution: "Universitas Coding",
      location: "Bandung",
      startDate: "2018-09",
      endDate: "2022-05",
      current: false,
      gpa: "3.8",
    },
  ],
  skills: ["React", "TypeScript", "Next.js"],
  summary: "A passionate developer.",
};

interface DashboardProps {
  onCreateCV?: (lang: "id" | "en") => void;
}

export function Dashboard({ onCreateCV }: DashboardProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [cvs, setCvs] = useState(dummyCVs);
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
  const [scoringResult, setScoringResult] = useState<CVScoringData | null>(
    null
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

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
            "Tambahkan lebih banyak kata kunci yang relevan dari deskripsi pekerjaan.",
            "Kuantifikasi pencapaian Anda dengan angka untuk dampak yang lebih besar.",
          ],
        };
        setScoringResult(mockResult);
        break;
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
    setCvs((prevCvs) =>
      prevCvs.map((cv) => (cv.id === cvId ? { ...cv, visibility } : cv))
    );
    toast.success("Visibilitas CV berhasil diubah!", {
      description: `CV kini diatur sebagai ${
        visibility === "public" ? "Publik" : "Privat"
      }.`,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.cv) {
      setCvs((prev) => prev.filter((cv) => cv.id !== deleteModal.cv!.id));
      toast.success(`CV "${deleteModal.cv.name}" telah dihapus.`);
      setDeleteModal({ isOpen: false, cv: null });
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
    const matchesSearch = cv.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filters.status === "Semua Status" ||
      (filters.status === "Selesai" && cv.status === "Completed") ||
      (filters.status === "Draft" && cv.status === "Draft");
    const matchesYear =
      filters.year === "Semua Tahun" || cv.year.toString() === filters.year;
    const matchesScore =
      cv.score >= filters.scoreRange[0] && cv.score <= filters.scoreRange[1];

    return matchesSearch && matchesStatus && matchesYear && matchesScore;
  });

  const totalPages = Math.ceil(filteredCVs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCVs = filteredCVs.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: cvs.length,
    avgScore: Math.round(
      cvs.reduce((sum, cv) => sum + cv.score, 0) / (cvs.length || 1)
    ),
    completed: cvs.filter((cv) => cv.status === "Completed").length,
    drafted: cvs.filter((cv) => cv.status === "Draft").length,
  };

  if (scoringResult) {
    return (
      <CVScoringResult
        data={scoringResult}
        cvBuilderData={mockBuilderData}
        onBack={handleBackToDashboard}
        onSaveToRepository={() => {
          toast.success("Aksi ini akan kembali ke Dashboard.");
          handleBackToDashboard();
        }}
      />
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
          title="Total Draft"
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
            <span className="ml-1 text-xs sm:text-sm hidden sm:inline">
              Cards
            </span>
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
            <span className="ml-1 text-xs sm:text-sm hidden sm:inline">
              Table
            </span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={`${
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer hover:bg-[var(--red-light)] hover:text-[var(--red-normal)]"
                      } transition-colors`}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
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
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={`${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer hover:bg-[var(--red-light)] hover:text-[var(--red-normal)]"
                      } transition-colors`}
                    />
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
