// src/components/dashboard/Dashboard.tsx
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
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
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

interface DashboardProps {
  onCreateCV?: (lang: "id" | "en") => void;
}

export function Dashboard({ onCreateCV }: DashboardProps) {
  const router = useRouter();
  const { user, deleteCV, updateCV } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [scoringResult, setScoringResult] = useState<any | null>(null);

  useEffect(() => {
    const fetchCVs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const q = query(
          collection(db, "cvs"),
          where("owner", "==", user.id),
          orderBy("updated", "desc")
        );
        const querySnapshot = await getDocs(q);
        const userCVs = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created: (data.created as Timestamp)
              .toDate()
              .toLocaleString("id-ID"),
            updated: (data.updated as Timestamp)
              .toDate()
              .toLocaleString("id-ID"),
          } as CVData;
        });
        setCvs(userCVs);
      } catch (error) {
        console.error("Gagal memuat CV dari Firestore:", error);
        toast.error("Gagal memuat repositori CV Anda.");
      } finally {
        setLoading(false);
      }
    };
    fetchCVs();
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleUpdate = (cv: CVData) => router.push(`/cv-builder?id=${cv.id}`);

  const handlePreview = (cv: CVData) => router.push(`/cv/${cv.id}`);

  const handleScore = (cv: CVData) => {
    const mockResult = {
      isCv: true,
      fileName: cv.name,
      overallScore: cv.score,
      atsCompatibility: Math.min(cv.score + 5, 100),
      keywordMatch: Math.max(cv.score - 3, 0),
      readabilityScore: Math.min(cv.score + 2, 100),
      sections: [
        {
          name: "Analisis Konten",
          score: cv.score,
          status: "good",
          feedback: "Konten relevan dengan posisi yang dituju.",
        },
      ],
      suggestions: ["Kuantifikasi pencapaian Anda untuk dampak lebih besar."],
    };
    setScoringResult(mockResult);
  };

  const handleDownload = (cv: CVData) =>
    toast.info(`Fitur download untuk "${cv.name}" akan segera hadir.`);

  const handleShare = (cv: CVData) => {
    if (cv.visibility === "private") {
      toast.warning(
        "Ubah privasi CV menjadi 'Publik' untuk dapat membagikan link."
      );
      return;
    }
    const shareUrl = `${window.location.origin}/cv/${cv.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success(`Link publik untuk "${cv.name}" berhasil disalin!`);
    });
  };

  const handleVisibilityChange = async (
    cvId: string,
    visibility: "public" | "private"
  ) => {
    try {
      await updateCV(cvId, { visibility });
      setCvs((prev) =>
        prev.map((cv) => (cv.id === cvId ? { ...cv, visibility } : cv))
      );
      toast.success("Visibilitas CV berhasil diubah.");
    } catch {
      toast.error("Gagal mengubah visibilitas.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.cv) {
      const toastId = toast.loading("Menghapus CV...");
      try {
        await deleteCV(deleteModal.cv.id);
        setCvs((prev) => prev.filter((cv) => cv.id !== deleteModal.cv!.id));
        toast.success(`CV "${deleteModal.cv.name}" telah dihapus.`, {
          id: toastId,
        });
      } catch {
        toast.error("Gagal menghapus CV.", { id: toastId });
      } finally {
        setDeleteModal({ isOpen: false, cv: null });
      }
    }
  };

  const handleLanguageSelect = (lang: "id" | "en") => {
    setIsLangModalOpen(false);
    if (onCreateCV) onCreateCV(lang);
  };

  const filteredCVs = cvs.filter((cv) => {
    const matchesSearch = cv.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filters.status === "Semua Status" ||
      cv.status === (filters.status === "Selesai" ? "Completed" : "Draft");
    const matchesYear =
      filters.year === "Semua Tahun" || cv.year.toString() === filters.year;
    const matchesScore =
      cv.score >= filters.scoreRange[0] && cv.score <= filters.scoreRange[1];
    return matchesSearch && matchesStatus && matchesYear && matchesScore;
  });

  const totalPages = Math.ceil(filteredCVs.length / itemsPerPage);
  const paginatedCVs = filteredCVs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: cvs.length,
    avgScore: Math.round(
      cvs.reduce((sum, cv) => sum + (cv.score || 0), 0) / (cvs.length || 1)
    ),
    completed: cvs.filter((cv) => cv.status === "Completed").length,
    drafted: cvs.filter((cv) => cv.status === "Draft").length,
  };

  if (scoringResult) {
    return (
      <CVScoringResult
        data={scoringResult}
        onBack={() => setScoringResult(null)}
        onSaveToRepository={() => {}}
        isFromRepository={true}
      />
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 bg-[var(--surface)] min-h-screen min-w-0">
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
              Pilih bahasa untuk CV baru Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => handleLanguageSelect("id")}
            >
              Bahasa Indonesia
            </Button>
            <Button onClick={() => handleLanguageSelect("en")}>English</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
        <StatTile title="CV Dibuat" value={stats.total} icon={FileText} />
        <StatTile
          title="Skor Rata-rata"
          value={stats.avgScore}
          icon={TrendingUp}
        />
        <StatTile
          title="Total Selesai"
          value={stats.completed}
          icon={CheckCircle}
        />
        <StatTile title="Total Draf" value={stats.drafted} icon={Edit3} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-4">
          Repositori CV Anda
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
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Cari CV Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setIsLangModalOpen(true)}
          className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat CV
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-600">
          Menampilkan {paginatedCVs.length} dari {filteredCVs.length} CV
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

      {loading ? (
        <p className="text-center py-10">Memuat repositori CV...</p>
      ) : paginatedCVs.length === 0 ? (
        <EmptyState
          title="Repositori Kosong"
          description="Anda belum memiliki CV. Buat CV pertama Anda untuk memulai."
          action={{
            label: "Buat CV Baru",
            onClick: () => setIsLangModalOpen(true),
          }}
        />
      ) : (
        <>
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {paginatedCVs.map((cv) => (
                <CVCard
                  key={cv.id}
                  cv={cv}
                  actionType="builder"
                  onPreview={handlePreview}
                  onScore={handleScore}
                  onDownload={handleDownload}
                  onUpdate={handleUpdate}
                  onDelete={() => setDeleteModal({ isOpen: true, cv })}
                  onShare={handleShare}
                  onVisibilityChange={handleVisibilityChange}
                />
              ))}
            </div>
          ) : (
            <CVTable
              cvs={paginatedCVs}
              actionType="builder"
              onPreview={handlePreview}
              onDownload={handleDownload}
              onUpdate={handleUpdate}
              onDelete={(cv) => setDeleteModal({ isOpen: true, cv })}
              onShare={handleShare}
              onVisibilityChange={handleVisibilityChange}
            />
          )}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.max(1, p - 1));
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
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
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
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
    </div>
  );
}
