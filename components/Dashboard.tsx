import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { StatTile } from "./StatTile";
import { CVFilters } from "./CVFilters";
import { CVCard, CVData } from "./CVCard";
import { CVTable } from "./CVTable";
import { EmptyState } from "./EmptyState";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import {
  Search,
  Plus,
  Grid,
  List,
  FileText,
  TrendingUp,
  CheckCircle,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";

// Dummy data
const dummyCVs: CVData[] = [
  {
    id: "1",
    name: "CV Frontend Developer",
    category: "Frontend",
    year: 2025,
    created: "15 Jan 2025, 14:30",
    updated: "17 Jan 2025, 09:15",
    status: "Completed",
    score: 81,
  },
  {
    id: "2",
    name: "Resume Backend Engineer",
    category: "Backend",
    year: 2024,
    created: "10 Jan 2025, 16:45",
    updated: "10 Jan 2025, 16:45",
    status: "Completed",
    score: 72,
  },
  {
    id: "3",
    name: "Portfolio Data Scientist",
    category: "Data",
    year: 2023,
    created: "12 Jan 2025, 11:20",
    updated: "14 Jan 2025, 13:50",
    status: "Completed",
    score: 90,
  },
  {
    id: "4",
    name: "CV UI/UX Designer",
    category: "UI/UX",
    year: 2025,
    created: "08 Jan 2025, 10:15",
    updated: "12 Jan 2025, 15:30",
    status: "Draft",
    score: 65,
  },
  {
    id: "5",
    name: "Resume Product Manager",
    category: "Product Manager",
    year: 2022,
    created: "20 Des 2024, 09:00",
    updated: "20 Des 2024, 09:00",
    status: "Draft",
    score: 58,
  },
  {
    id: "6",
    name: "CV Fresh Graduate",
    category: "Fresh Graduate",
    year: 2025,
    created: "16 Jan 2025, 08:45",
    updated: "16 Jan 2025, 18:20",
    status: "Completed",
    score: 84,
  },
  {
    id: "7",
    name: "CV React Developer",
    category: "Frontend",
    year: 2024,
    created: "28 Des 2024, 15:20",
    updated: "03 Jan 2025, 11:30",
    status: "Completed",
    score: 85,
  },
  {
    id: "8",
    name: "Portfolio Machine Learning Engineer",
    category: "Data",
    year: 2025,
    created: "20 Des 2024, 10:15",
    updated: "20 Des 2024, 10:15",
    status: "Draft",
    score: 78,
  },
  {
    id: "9",
    name: "Resume DevOps Engineer",
    category: "Backend",
    year: 2024,
    created: "18 Des 2024, 14:45",
    updated: "22 Des 2024, 16:20",
    status: "Completed",
    score: 92,
  },
  {
    id: "10",
    name: "CV Senior Frontend",
    category: "Frontend",
    year: 2023,
    created: "15 Des 2024, 09:30",
    updated: "15 Des 2024, 09:30",
    status: "Draft",
    score: 88,
  },
  {
    id: "11",
    name: "Portfolio UX Researcher",
    category: "UI/UX",
    year: 2025,
    created: "12 Des 2024, 13:15",
    updated: "18 Des 2024, 10:45",
    status: "Completed",
    score: 76,
  },
  {
    id: "12",
    name: "Resume Full Stack Developer",
    category: "Frontend",
    year: 2024,
    created: "10 Des 2024, 16:30",
    updated: "10 Des 2024, 16:30",
    status: "Draft",
    score: 82,
  },
  {
    id: "13",
    name: "CV Data Analyst",
    category: "Data",
    year: 2025,
    created: "08 Des 2024, 11:20",
    updated: "14 Des 2024, 15:30",
    status: "Completed",
    score: 74,
  },
  {
    id: "14",
    name: "Portfolio Mobile Developer",
    category: "Frontend",
    year: 2024,
    created: "05 Des 2024, 14:45",
    updated: "05 Des 2024, 14:45",
    status: "Draft",
    score: 79,
  },
  {
    id: "15",
    name: "Resume Software Architect",
    category: "Backend",
    year: 2023,
    created: "03 Des 2024, 09:15",
    updated: "07 Des 2024, 12:20",
    status: "Completed",
    score: 95,
  },
  {
    id: "16",
    name: "CV Technical Product Manager",
    category: "Product Manager",
    year: 2025,
    created: "01 Des 2024, 17:30",
    updated: "01 Des 2024, 17:30",
    status: "Draft",
    score: 83,
  },
  {
    id: "17",
    name: "Portfolio AI Engineer",
    category: "Data",
    year: 2024,
    created: "28 Nov 2024, 10:45",
    updated: "30 Nov 2024, 14:15",
    status: "Completed",
    score: 91,
  },
  {
    id: "18",
    name: "Resume QA Engineer",
    category: "Backend",
    year: 2025,
    created: "25 Nov 2024, 16:20",
    updated: "25 Nov 2024, 16:20",
    status: "Draft",
    score: 67,
  },
];

interface DashboardProps {
  onCreateCV?: () => void;
}

export function Dashboard({ onCreateCV }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [filters, setFilters] = useState({
    status: "Semua Status",
    category: "Semua Kategori",
    year: "Semua Tahun",
    scoreRange: [1, 100],
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    cv: CVData | null;
  }>({
    isOpen: false,
    cv: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Increased for better grid layout

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Filter CVs based on search and filters
  const filteredCVs = dummyCVs.filter((cv) => {
    const matchesSearch = cv.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filters.status === "Semua Status" ||
      (filters.status === "Selesai" && cv.status === "Completed") ||
      (filters.status === "Draft" && cv.status === "Draft");
    const matchesCategory =
      filters.category === "Semua Kategori" || cv.category === filters.category;
    const matchesYear =
      filters.year === "Semua Tahun" || cv.year.toString() === filters.year;
    const matchesScore =
      cv.score >= filters.scoreRange[0] && cv.score <= filters.scoreRange[1];

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesYear &&
      matchesScore
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredCVs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCVs = filteredCVs.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = {
    total: dummyCVs.length,
    avgScore: Math.round(
      dummyCVs.reduce((sum, cv) => sum + cv.score, 0) / dummyCVs.length
    ),
    completed: dummyCVs.filter((cv) => cv.status === "Completed").length,
    drafted: dummyCVs.filter((cv) => cv.status === "Draft").length,
  };

  const handleCreateCV = () => {
    if (onCreateCV) {
      onCreateCV();
    } else {
      console.log("Navigate to CV builder");
    }
  };

  const handleCVAction = (action: string, cv: CVData) => {
    switch (action) {
      case "preview":
        console.log("Preview CV:", cv.name);
        // TODO: Open CV preview modal or navigate to preview page
        break;
      case "download":
        console.log("Download PDF:", cv.name);
        // TODO: Generate and download PDF
        break;
      case "update":
        console.log("Edit CV:", cv.name);
        // TODO: Navigate to CV editor
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
    const shareUrl = `${window.location.origin}/cv/${cv.id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success(`Link CV "${cv.name}" berhasil disalin ke clipboard!`, {
          description:
            "Link dapat dibagikan ke siapa saja untuk melihat CV Anda dalam mode read-only",
        });
      })
      .catch(() => {
        toast.error("Gagal menyalin link", {
          description: "Silakan coba lagi atau gunakan cara manual",
        });
      });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.cv) {
      console.log("Delete CV:", deleteModal.cv.name);
      setDeleteModal({ isOpen: false, cv: null });
    }
  };

  const resetFilters = () => {
    setFilters({
      status: "Semua Status",
      category: "Semua Kategori",
      year: "Semua Tahun",
      scoreRange: [1, 100],
    });
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-[var(--surface)] min-h-screen">
      {/* Page Header */}
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

      {/* Statistics */}
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
        />
        <StatTile title="Total Draft" value={stats.drafted} icon={Edit3} />
      </div>

      {/* Filters */}
      <CVFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      {/* Search Bar & Create CV Button Row */}
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
          onClick={handleCreateCV}
          className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="text-sm sm:text-base">Buat CV</span>
        </Button>
      </div>

      {/* View Toggle & Results */}
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

      {/* CV List */}
      {paginatedCVs.length === 0 ? (
        <EmptyState
          title="CV Tidak Ditemukan"
          description="Tidak ada CV yang sesuai dengan filter Anda. Coba sesuaikan kriteria pencarian atau buat CV baru untuk memulai."
          action={{
            label: "Buat CV Pertama Anda",
            onClick: handleCreateCV,
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
                />
              ))}
            </div>
          ) : (
            <div className="mb-6 sm:mb-8 overflow-x-auto">
              <div className="min-w-[600px]">
                <CVTable
                  cvs={paginatedCVs}
                  onPreview={(cv) => handleCVAction("preview", cv)}
                  onDownload={(cv) => handleCVAction("download", cv)}
                  onUpdate={(cv) => handleCVAction("update", cv)}
                  onDelete={(cv) => handleCVAction("delete", cv)}
                  onShare={(cv) => handleCVAction("share", cv)}
                />
              </div>
            </div>
          )}

          {/* Pagination */}
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

                  {/* Smart pagination for mobile */}
                  {totalPages <= 7 ? (
                    // Show all pages if 7 or fewer
                    Array.from({ length: totalPages }, (_, i) => (
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
                    ))
                  ) : (
                    // Smart truncation for many pages
                    <>
                      {/* First page */}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(1)}
                          isActive={currentPage === 1}
                          className={`cursor-pointer transition-colors ${
                            currentPage === 1
                              ? "bg-[var(--red-normal)] text-white hover:bg-[var(--red-normal-hover)]"
                              : "hover:bg-[var(--red-light)] hover:text-[var(--red-normal)]"
                          }`}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>

                      {/* Left ellipsis */}
                      {currentPage > 3 && (
                        <PaginationItem>
                          <span className="px-3 py-2 text-gray-500">...</span>
                        </PaginationItem>
                      )}

                      {/* Current page area */}
                      {Array.from({ length: 3 }, (_, i) => {
                        const pageNum = currentPage - 1 + i;
                        if (pageNum < 2 || pageNum > totalPages - 1)
                          return null;
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className={`cursor-pointer transition-colors ${
                                currentPage === pageNum
                                  ? "bg-[var(--red-normal)] text-white hover:bg-[var(--red-normal-hover)]"
                                  : "hover:bg-[var(--red-light)] hover:text-[var(--red-normal)]"
                              }`}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      {/* Right ellipsis */}
                      {currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <span className="px-3 py-2 text-gray-500">...</span>
                        </PaginationItem>
                      )}

                      {/* Last page */}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages)}
                          isActive={currentPage === totalPages}
                          className={`cursor-pointer transition-colors ${
                            currentPage === totalPages
                              ? "bg-[var(--red-normal)] text-white hover:bg-[var(--red-normal-hover)]"
                              : "hover:bg-[var(--red-light)] hover:text-[var(--red-normal)]"
                          }`}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

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

              {/* Pagination Info */}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, cv: null })}
        onConfirm={handleDeleteConfirm}
        cv={deleteModal.cv}
      />
    </div>
  );
}
